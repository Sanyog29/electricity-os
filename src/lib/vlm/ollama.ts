/**
 * Ollama VLM Client
 * Connects to local Ollama server for vision model inference
 */

import {
    VLMProvider,
    ExtractedBillData,
    InsightResponse,
    BillScanResult,
    DEFAULT_OLLAMA_BASE_URL,
    DEFAULT_OLLAMA_MODEL,
} from './types';

// Get configuration from environment
const getOllamaConfig = () => ({
    baseUrl: process.env.OLLAMA_BASE_URL || DEFAULT_OLLAMA_BASE_URL,
    model: process.env.OLLAMA_MODEL || DEFAULT_OLLAMA_MODEL,
});

interface OllamaGenerateResponse {
    model: string;
    response: string;
    done: boolean;
}

interface OllamaTagsResponse {
    models: Array<{
        name: string;
        size: number;
        digest: string;
    }>;
}

/**
 * Bill extraction prompt - same logic as Gemini but formatted for Ollama
 */
const BILL_EXTRACTION_PROMPT = `You are an expert at reading and analyzing Indian electricity bills from various DISCOMs (MSEDCL, BESCOM, TATA Power, BSES, CESC, TNEB, UPPCL, PSPCL, etc.).

Carefully examine this electricity bill image and extract ALL available information.

IMPORTANT EXTRACTION RULES:
1. Extract exact values as shown on the bill
2. For amounts, use numbers only (no ₹ symbol)
3. For dates, use YYYY-MM-DD format
4. For billing period, use format like "November 2024" or "Nov 2024"
5. Power factor should be a decimal between 0 and 1 (e.g., 0.92)
6. If a field is not visible or unclear, use null
7. Extract ALL line items visible (energy charges, fixed charges, taxes, surcharges, etc.)

Return the extracted data in this EXACT JSON format:
{
    "consumerNumber": "string or null",
    "meterNumber": "string or null",
    "billDate": "YYYY-MM-DD or null",
    "dueDate": "YYYY-MM-DD or null",
    "billingPeriod": "string like 'November 2024' or null",
    "totalAmount": number,
    "unitsConsumed": number,
    "previousReading": number or 0,
    "currentReading": number or 0,
    "maxDemand": number or 0,
    "powerFactor": number between 0 and 1 or 0,
    "discom": "MSEDCL, BESCOM, TATA Power, etc. or null",
    "tariffCategory": "LT-I, HT-I Industrial, etc. or null",
    "address": "consumer address or null",
    "sanctionedLoad": number in kW or 0,
    "contractDemand": number in kVA or 0,
    "lineItems": [
        {"description": "Energy Charges", "amount": number},
        {"description": "Fixed Charges", "amount": number}
    ],
    "confidence": number between 0 and 1,
    "warnings": ["any issues or unclear fields"]
}

RESPOND ONLY WITH VALID JSON. No explanations.`;

/**
 * Check if Ollama server is running and has the configured model
 */
export async function checkOllamaAvailability(): Promise<{
    available: boolean;
    model?: string;
    error?: string;
}> {
    const config = getOllamaConfig();

    try {
        const response = await fetch(`${config.baseUrl}/api/tags`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            return {
                available: false,
                error: `Ollama server returned ${response.status}`,
            };
        }

        const data: OllamaTagsResponse = await response.json();
        const modelName = config.model.split(':')[0]; // Handle tags like "llava:7b"

        const hasModel = data.models?.some(
            (m) => m.name.startsWith(modelName) || m.name === config.model
        );

        if (!hasModel) {
            return {
                available: false,
                error: `Model '${config.model}' not found. Available: ${data.models?.map((m) => m.name).join(', ') || 'none'}`,
            };
        }

        return { available: true, model: config.model };
    } catch (error) {
        return {
            available: false,
            error: error instanceof Error ? error.message : 'Failed to connect to Ollama',
        };
    }
}

/**
 * Scan bill image using Ollama VLM
 */
async function scanBillWithOllama(
    imageBase64: string,
    mimeType: string
): Promise<BillScanResult> {
    const config = getOllamaConfig();

    // Timeout for VLM requests (120 seconds - VLM processing can be slow)
    const TIMEOUT_MS = 120000;

    try {
        // Ollama expects images as base64 in the images array
        const requestBody = {
            model: config.model,
            prompt: BILL_EXTRACTION_PROMPT,
            images: [imageBase64],
            stream: false,
            // Ollama options for better performance
            options: {
                num_predict: 2048,  // Limit response length
                temperature: 0.1,   // More deterministic for extraction
            },
        };

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        console.log(`[VLM] Sending image to Ollama (${config.model})...`);

        const response = await fetch(`${config.baseUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ollama API error: ${response.status} - ${errorText}`);
        }

        const data: OllamaGenerateResponse = await response.json();
        const text = data.response;

        // Parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return {
                success: false,
                extractedData: null,
                insights: null,
                confidence: 0,
                warnings: ['Failed to parse bill data from image'],
                provider: 'ollama',
            };
        }

        const parsed = JSON.parse(jsonMatch[0]);
        const confidence = parsed.confidence || 0.75;
        const warnings = parsed.warnings || [];

        // Build extracted data
        const extractedData: ExtractedBillData = {
            consumerNumber: parsed.consumerNumber || '',
            meterNumber: parsed.meterNumber || '',
            billDate: parsed.billDate || '',
            dueDate: parsed.dueDate || '',
            billingPeriod: parsed.billingPeriod || '',
            totalAmount: Number(parsed.totalAmount) || 0,
            unitsConsumed: Number(parsed.unitsConsumed) || 0,
            previousReading: Number(parsed.previousReading) || 0,
            currentReading: Number(parsed.currentReading) || 0,
            maxDemand: Number(parsed.maxDemand) || 0,
            powerFactor: Number(parsed.powerFactor) || 0,
            discom: parsed.discom || '',
            tariffCategory: parsed.tariffCategory || '',
            address: parsed.address || '',
            sanctionedLoad: Number(parsed.sanctionedLoad) || 0,
            contractDemand: Number(parsed.contractDemand) || 0,
            lineItems: (parsed.lineItems || []).filter(
                (item: { description: string; amount: number }) => item.amount > 0
            ),
        };

        // Generate insights if we have data
        let insights: InsightResponse | null = null;
        if (extractedData.totalAmount > 0 && extractedData.unitsConsumed > 0) {
            insights = await generateInsightsWithOllama(extractedData);
        }

        return {
            success: true,
            extractedData,
            insights,
            confidence,
            warnings,
            rawText: text,
            provider: 'ollama',
        };
    } catch (error) {
        console.error('Ollama VLM scan error:', error);

        // Handle timeout/abort specifically
        let errorMessage = 'Failed to scan bill with Ollama';
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                errorMessage = 'Request timed out after 120 seconds. The image may be too large or complex. Try a smaller/clearer image.';
            } else {
                errorMessage = error.message;
            }
        }

        return {
            success: false,
            extractedData: null,
            insights: null,
            confidence: 0,
            warnings: [errorMessage],
            provider: 'ollama',
        };
    }
}

/**
 * Generate insights using Ollama (text-only, no image needed)
 */
async function generateInsightsWithOllama(
    data: ExtractedBillData
): Promise<InsightResponse> {
    const config = getOllamaConfig();

    // Use a text model if available, otherwise use the VLM
    const textModel = process.env.OLLAMA_TEXT_MODEL || config.model;

    const prompt = `You are an expert electricity bill analyst for Indian consumers. Analyze this bill data and provide actionable insights.

BILL DATA:
- DISCOM: ${data.discom || 'Unknown'}
- Tariff Category: ${data.tariffCategory || 'Unknown'}
- Billing Period: ${data.billingPeriod}
- Total Amount: ₹${data.totalAmount.toLocaleString()}
- Units Consumed: ${data.unitsConsumed} kWh
- Max Demand: ${data.maxDemand} kVA
- Power Factor: ${data.powerFactor}
- Sanctioned Load: ${data.sanctionedLoad} kW
- Contract Demand: ${data.contractDemand} kVA
- Line Items: ${JSON.stringify(data.lineItems)}

Return your analysis in this EXACT JSON format:
{
    "summary": "2-3 sentence summary of the bill analysis highlighting key findings",
    "insights": [
        "Specific insight 1 with numbers",
        "Specific insight 2 with numbers",
        "Specific insight 3 with numbers"
    ],
    "recommendations": [
        "Actionable recommendation 1",
        "Actionable recommendation 2",
        "Actionable recommendation 3"
    ],
    "potentialSavings": estimated_monthly_savings_in_rupees,
    "riskLevel": "low" | "medium" | "high"
}

RESPOND ONLY WITH VALID JSON.`;

    try {
        const response = await fetch(`${config.baseUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: textModel,
                prompt,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.status}`);
        }

        const result: OllamaGenerateResponse = await response.json();
        const text = result.response;

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                summary: parsed.summary || 'Bill analysis completed.',
                insights: parsed.insights || [],
                recommendations: parsed.recommendations || [],
                potentialSavings: Number(parsed.potentialSavings) || 0,
                riskLevel: parsed.riskLevel || 'low',
            };
        }

        throw new Error('Invalid insights response');
    } catch (error) {
        console.error('Ollama insights generation error:', error);
        // Return basic calculated insights
        const costPerUnit =
            data.unitsConsumed > 0 ? data.totalAmount / data.unitsConsumed : 0;
        const isPoorPF = data.powerFactor > 0 && data.powerFactor < 0.9;

        return {
            summary: `Your electricity bill for ${data.billingPeriod} shows consumption of ${data.unitsConsumed.toLocaleString()} kWh with a total cost of ₹${data.totalAmount.toLocaleString()}.`,
            insights: [
                `Cost per unit: ₹${costPerUnit.toFixed(2)}/kWh`,
                data.powerFactor > 0
                    ? `Power factor: ${data.powerFactor.toFixed(2)} ${isPoorPF ? '(needs improvement)' : '(acceptable)'}`
                    : 'Power factor data not available',
                data.maxDemand > 0
                    ? `Maximum demand: ${data.maxDemand} kVA`
                    : 'Demand data not available',
            ],
            recommendations: [
                isPoorPF
                    ? 'Consider installing capacitor banks to improve power factor'
                    : 'Maintain current power factor levels',
                'Review tariff structure for potential optimization',
                'Consider energy audit for efficiency improvements',
            ],
            potentialSavings: Math.floor(data.totalAmount * (isPoorPF ? 0.1 : 0.05)),
            riskLevel: isPoorPF ? 'medium' : 'low',
        };
    }
}

/**
 * Scan bill from text content using Ollama
 */
async function scanBillFromText(textContent: string): Promise<BillScanResult> {
    const config = getOllamaConfig();

    const prompt = `You are an expert at reading and analyzing Indian electricity bills.

Carefully analyze the following electricity bill text content and extract ALL available information.

BILL TEXT CONTENT:
${textContent}

IMPORTANT EXTRACTION RULES:
1. Extract exact values as shown in the text
2. For amounts, use numbers only (no ₹ symbol)
3. For dates, use YYYY-MM-DD format
4. For billing period, use format like "November 2024"
5. Power factor should be a decimal between 0 and 1
6. If a field cannot be determined, use null

Return the extracted data in this EXACT JSON format:
{
    "consumerNumber": "string or null",
    "meterNumber": "string or null",
    "billDate": "YYYY-MM-DD or null",
    "dueDate": "YYYY-MM-DD or null",
    "billingPeriod": "string like 'November 2024' or null",
    "totalAmount": number,
    "unitsConsumed": number,
    "previousReading": number or 0,
    "currentReading": number or 0,
    "maxDemand": number or 0,
    "powerFactor": number between 0 and 1 or 0,
    "discom": "MSEDCL, BESCOM, TATA Power, etc. or null",
    "tariffCategory": "LT-I, HT-I Industrial, etc. or null",
    "address": "consumer address or null",
    "sanctionedLoad": number in kW or 0,
    "contractDemand": number in kVA or 0,
    "lineItems": [
        {"description": "Energy Charges", "amount": number}
    ],
    "confidence": number between 0 and 1,
    "warnings": ["any issues or unclear fields"]
}

RESPOND ONLY WITH VALID JSON.`;

    try {
        const response = await fetch(`${config.baseUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: config.model,
                prompt,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.status}`);
        }

        const data: OllamaGenerateResponse = await response.json();
        const text = data.response;

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return {
                success: false,
                extractedData: null,
                insights: null,
                confidence: 0,
                warnings: ['Failed to parse bill data from text'],
                provider: 'ollama',
            };
        }

        const parsed = JSON.parse(jsonMatch[0]);
        const confidence = parsed.confidence || 0.7;
        const warnings = parsed.warnings || [];

        const extractedData: ExtractedBillData = {
            consumerNumber: parsed.consumerNumber || '',
            meterNumber: parsed.meterNumber || '',
            billDate: parsed.billDate || '',
            dueDate: parsed.dueDate || '',
            billingPeriod: parsed.billingPeriod || '',
            totalAmount: Number(parsed.totalAmount) || 0,
            unitsConsumed: Number(parsed.unitsConsumed) || 0,
            previousReading: Number(parsed.previousReading) || 0,
            currentReading: Number(parsed.currentReading) || 0,
            maxDemand: Number(parsed.maxDemand) || 0,
            powerFactor: Number(parsed.powerFactor) || 0,
            discom: parsed.discom || '',
            tariffCategory: parsed.tariffCategory || '',
            address: parsed.address || '',
            sanctionedLoad: Number(parsed.sanctionedLoad) || 0,
            contractDemand: Number(parsed.contractDemand) || 0,
            lineItems: (parsed.lineItems || []).filter(
                (item: { description: string; amount: number }) => item.amount > 0
            ),
        };

        let insights: InsightResponse | null = null;
        if (extractedData.totalAmount > 0 && extractedData.unitsConsumed > 0) {
            insights = await generateInsightsWithOllama(extractedData);
        }

        return {
            success: true,
            extractedData,
            insights,
            confidence,
            warnings,
            rawText: textContent,
            provider: 'ollama',
        };
    } catch (error) {
        console.error('Ollama text scan error:', error);
        return {
            success: false,
            extractedData: null,
            insights: null,
            confidence: 0,
            warnings: [
                error instanceof Error
                    ? error.message
                    : 'Failed to scan text with Ollama',
            ],
            provider: 'ollama',
        };
    }
}

/**
 * Ollama VLM Provider implementation
 */
export const ollamaProvider: VLMProvider = {
    name: 'ollama',

    async isAvailable(): Promise<boolean> {
        const status = await checkOllamaAvailability();
        return status.available;
    },

    async scanBill(content: string, mimeType: string): Promise<BillScanResult> {
        // Handle text files
        if (mimeType === 'text/plain') {
            return scanBillFromText(content);
        }

        // For images and PDFs, use VLM
        // Note: Ollama doesn't natively support PDFs, so we treat them as images
        // The frontend should convert PDFs to images before sending
        if (mimeType.startsWith('image/') || mimeType === 'application/pdf') {
            return scanBillWithOllama(content, mimeType);
        }

        return {
            success: false,
            extractedData: null,
            insights: null,
            confidence: 0,
            warnings: [`Unsupported file type: ${mimeType}`],
            provider: 'ollama',
        };
    },

    async generateInsights(data: ExtractedBillData): Promise<InsightResponse> {
        return generateInsightsWithOllama(data);
    },
};

export default ollamaProvider;
