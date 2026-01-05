import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

// Initialize Gemini AI - use server-side key for API routes
const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
);

// Safety settings for bill processing
const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

/**
 * Retry helper with exponential backoff for rate limit errors
 * @param fn - The async function to retry
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param baseDelay - Base delay in milliseconds (default: 2000)
 */
async function withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 2000
): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));

            // Check if it's a rate limit error (429)
            const isRateLimit = lastError.message.includes('429') ||
                lastError.message.includes('Resource exhausted') ||
                lastError.message.includes('Too Many Requests') ||
                lastError.message.includes('quota');

            if (!isRateLimit || attempt >= maxRetries) {
                throw lastError;
            }

            // Exponential backoff: 2s, 4s, 8s...
            const delay = baseDelay * Math.pow(2, attempt);
            console.log(`[Gemini] Rate limit hit, retrying in ${delay / 1000}s (attempt ${attempt + 1}/${maxRetries})...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}

export interface BillData {
    site: string;
    month: string;
    totalAmount: number;
    unitsConsumed: number;
    maxDemand?: number;
    powerFactor?: number;
    lineItems?: Array<{
        type: string;
        amount: number;
    }>;
}

export interface InsightResponse {
    summary: string;
    insights: string[];
    recommendations: string[];
    potentialSavings: number;
    riskLevel: 'low' | 'medium' | 'high';
}

export interface ExtractedBillData {
    consumerNumber: string;
    meterNumber: string;
    billDate: string;
    dueDate: string;
    billingPeriod: string;
    totalAmount: number;
    unitsConsumed: number;
    previousReading: number;
    currentReading: number;
    maxDemand: number;
    powerFactor: number;
    discom: string;
    tariffCategory: string;
    address: string;
    sanctionedLoad: number;
    contractDemand: number;
    lineItems: Array<{
        description: string;
        amount: number;
    }>;
}

export interface BillScanResult {
    success: boolean;
    extractedData: ExtractedBillData | null;
    insights: InsightResponse | null;
    confidence: number;
    warnings: string[];
    rawText?: string;
}

/**
 * Enhanced bill extraction using Gemini VLM
 * Supports images (JPG, PNG) and will extract comprehensive data
 */
export async function scanBillWithVLM(
    imageBase64: string,
    mimeType: string
): Promise<BillScanResult> {
    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-001',
            safetySettings,
        });

        const extractionPrompt = `You are an expert at reading and analyzing Indian electricity bills from various DISCOMs (MSEDCL, BESCOM, TATA Power, BSES, CESC, TNEB, UPPCL, PSPCL, etc.).

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
        {"description": "Fixed Charges", "amount": number},
        {"description": "Demand Charges", "amount": number},
        {"description": "Electricity Duty", "amount": number},
        {"description": "FAC (Fuel Adjustment)", "amount": number},
        {"description": "Wheeling Charges", "amount": number},
        {"description": "Other charges/taxes", "amount": number}
    ],
    "confidence": number between 0 and 1,
    "warnings": ["any issues or unclear fields"]
}

RESPOND ONLY WITH VALID JSON. No explanations.`;

        // Use retry wrapper to handle rate limits
        const result = await withRetry(() => model.generateContent([
            extractionPrompt,
            {
                inlineData: {
                    mimeType: mimeType,
                    data: imageBase64,
                },
            },
        ]));

        const response = await result.response;
        const text = response.text();

        // Parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return {
                success: false,
                extractedData: null,
                insights: null,
                confidence: 0,
                warnings: ['Failed to parse bill data from image'],
            };
        }

        const parsed = JSON.parse(jsonMatch[0]);
        const confidence = parsed.confidence || 0.8;
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

        // If we have data, generate insights
        let insights: InsightResponse | null = null;
        if (extractedData.totalAmount > 0 && extractedData.unitsConsumed > 0) {
            insights = await generateBillInsights(extractedData);
        }

        return {
            success: true,
            extractedData,
            insights,
            confidence,
            warnings,
            rawText: text,
        };
    } catch (error) {
        console.error('Gemini VLM scan error:', error);
        return {
            success: false,
            extractedData: null,
            insights: null,
            confidence: 0,
            warnings: [
                error instanceof Error
                    ? error.message
                    : 'Failed to scan bill with AI',
            ],
        };
    }
}

/**
 * Scan bill from PDF file using Gemini's native PDF support
 * Gemini 1.5 can process PDFs directly
 */
export async function scanBillFromPDF(
    pdfBase64: string
): Promise<BillScanResult> {
    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-001',
            safetySettings,
        });

        const extractionPrompt = `You are an expert at reading and analyzing Indian electricity bills from various DISCOMs (MSEDCL, BESCOM, TATA Power, BSES, CESC, TNEB, UPPCL, PSPCL, etc.).

Carefully examine this electricity bill PDF document and extract ALL available information.

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
        {"description": "Fixed Charges", "amount": number},
        {"description": "Demand Charges", "amount": number},
        {"description": "Electricity Duty", "amount": number},
        {"description": "FAC (Fuel Adjustment)", "amount": number},
        {"description": "Wheeling Charges", "amount": number},
        {"description": "Other charges/taxes", "amount": number}
    ],
    "confidence": number between 0 and 1,
    "warnings": ["any issues or unclear fields"]
}

RESPOND ONLY WITH VALID JSON. No explanations.`;

        // Use retry wrapper to handle rate limits
        const result = await withRetry(() => model.generateContent([
            extractionPrompt,
            {
                inlineData: {
                    mimeType: 'application/pdf',
                    data: pdfBase64,
                },
            },
        ]));

        const response = await result.response;
        const text = response.text();

        // Parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return {
                success: false,
                extractedData: null,
                insights: null,
                confidence: 0,
                warnings: ['Failed to parse bill data from PDF'],
            };
        }

        const parsed = JSON.parse(jsonMatch[0]);
        const confidence = parsed.confidence || 0.85;
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

        // Generate insights
        let insights: InsightResponse | null = null;
        if (extractedData.totalAmount > 0 && extractedData.unitsConsumed > 0) {
            insights = await generateBillInsights(extractedData);
        }

        return {
            success: true,
            extractedData,
            insights,
            confidence,
            warnings,
            rawText: text,
        };
    } catch (error) {
        console.error('Gemini PDF scan error:', error);
        return {
            success: false,
            extractedData: null,
            insights: null,
            confidence: 0,
            warnings: [
                error instanceof Error
                    ? error.message
                    : 'Failed to scan PDF with AI',
            ],
        };
    }
}

/**
 * Extract bill data from plain text content
 * Useful for text files or pre-extracted OCR text
 */
export async function scanBillFromText(
    textContent: string
): Promise<BillScanResult> {
    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-001',
            safetySettings,
        });

        const extractionPrompt = `You are an expert at reading and analyzing Indian electricity bills from various DISCOMs (MSEDCL, BESCOM, TATA Power, BSES, CESC, TNEB, UPPCL, PSPCL, etc.).

Carefully analyze the following electricity bill text content and extract ALL available information.

BILL TEXT CONTENT:
${textContent}

IMPORTANT EXTRACTION RULES:
1. Extract exact values as shown in the text
2. For amounts, use numbers only (no ₹ symbol)
3. For dates, use YYYY-MM-DD format
4. For billing period, use format like "November 2024" or "Nov 2024"
5. Power factor should be a decimal between 0 and 1 (e.g., 0.92)
6. If a field cannot be determined, use null
7. Extract ALL line items mentioned (energy charges, fixed charges, taxes, surcharges, etc.)

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
        {"description": "Fixed Charges", "amount": number},
        {"description": "Demand Charges", "amount": number},
        {"description": "Electricity Duty", "amount": number},
        {"description": "FAC (Fuel Adjustment)", "amount": number},
        {"description": "Wheeling Charges", "amount": number},
        {"description": "Other charges/taxes", "amount": number}
    ],
    "confidence": number between 0 and 1,
    "warnings": ["any issues or unclear fields"]
}

RESPOND ONLY WITH VALID JSON. No explanations.`;

        // Use retry wrapper to handle rate limits
        const result = await withRetry(() => model.generateContent(extractionPrompt));
        const response = await result.response;
        const text = response.text();

        // Parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return {
                success: false,
                extractedData: null,
                insights: null,
                confidence: 0,
                warnings: ['Failed to parse bill data from text'],
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

        // Generate insights
        let insights: InsightResponse | null = null;
        if (extractedData.totalAmount > 0 && extractedData.unitsConsumed > 0) {
            insights = await generateBillInsights(extractedData);
        }

        return {
            success: true,
            extractedData,
            insights,
            confidence,
            warnings,
            rawText: textContent,
        };
    } catch (error) {
        console.error('Gemini text scan error:', error);
        return {
            success: false,
            extractedData: null,
            insights: null,
            confidence: 0,
            warnings: [
                error instanceof Error
                    ? error.message
                    : 'Failed to scan text with AI',
            ],
        };
    }
}

/**
 * Unified bill scanning function that auto-detects file type
 * Supports: images (JPG, PNG, WebP), PDF, and text files
 */
export async function scanBill(
    fileContent: string,
    mimeType: string
): Promise<BillScanResult> {
    // Check if it's a text file
    if (mimeType === 'text/plain') {
        return scanBillFromText(fileContent);
    }

    // Check if it's a PDF
    if (mimeType === 'application/pdf') {
        return scanBillFromPDF(fileContent);
    }

    // For images (JPG, PNG, WebP, etc.)
    if (mimeType.startsWith('image/')) {
        return scanBillWithVLM(fileContent, mimeType);
    }

    // Unsupported file type
    return {
        success: false,
        extractedData: null,
        insights: null,
        confidence: 0,
        warnings: [`Unsupported file type: ${mimeType}. Supported: JPG, PNG, PDF, TXT`],
    };
}

/**
 * Generate intelligent insights from extracted bill data
 */
export async function generateBillInsights(
    data: ExtractedBillData
): Promise<InsightResponse> {
    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-001',
            safetySettings,
        });

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

ANALYSIS REQUIREMENTS:
1. Calculate cost per unit and compare to typical rates
2. Evaluate power factor (penalty below 0.9, incentive above 0.95)
3. Check if max demand exceeds contract demand (penalty assessment)
4. Identify potential tariff optimization opportunities
5. Suggest energy efficiency measures
6. Estimate realistic savings potential

Return your analysis in this EXACT JSON format:
{
    "summary": "2-3 sentence summary of the bill analysis highlighting key findings",
    "insights": [
        "Specific insight 1 with numbers",
        "Specific insight 2 with numbers",
        "Specific insight 3 with numbers",
        "Specific insight 4 if applicable"
    ],
    "recommendations": [
        "Actionable recommendation 1",
        "Actionable recommendation 2",
        "Actionable recommendation 3"
    ],
    "potentialSavings": estimated_monthly_savings_in_rupees,
    "riskLevel": "low" | "medium" | "high"
}

RISK LEVEL CRITERIA:
- low: Power factor > 0.9, demand within limits, costs normal
- medium: Power factor 0.85-0.9 OR demand close to limits OR higher than average costs
- high: Power factor < 0.85 OR demand exceeds contract OR unusual charges detected

RESPOND ONLY WITH VALID JSON.`;

        // Use retry wrapper to handle rate limits
        const result = await withRetry(() => model.generateContent(prompt));
        const response = await result.response;
        const text = response.text();

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
        console.error('Insights generation error:', error);
        // Return basic calculated insights
        const costPerUnit = data.unitsConsumed > 0
            ? data.totalAmount / data.unitsConsumed
            : 0;
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
                isPoorPF ? 'Consider installing capacitor banks to improve power factor' : 'Maintain current power factor levels',
                'Review tariff structure for potential optimization',
                'Consider energy audit for efficiency improvements',
            ],
            potentialSavings: Math.floor(data.totalAmount * (isPoorPF ? 0.1 : 0.05)),
            riskLevel: isPoorPF ? 'medium' : 'low',
        };
    }
}

/**
 * Legacy function - kept for backward compatibility
 */
export async function analyzeBill(billData: BillData): Promise<InsightResponse> {
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-001',
        safetySettings,
    });

    const prompt = `You are an expert electricity bill analyst for Indian DISCOMs. Analyze the following electricity bill data and provide insights:

Bill Data:
- Site: ${billData.site}
- Month: ${billData.month}
- Total Amount: ₹${billData.totalAmount}
- Units Consumed: ${billData.unitsConsumed} kWh
${billData.maxDemand ? `- Max Demand: ${billData.maxDemand} kVA` : ''}
${billData.powerFactor ? `- Power Factor: ${billData.powerFactor}` : ''}
${billData.lineItems ? `- Line Items: ${JSON.stringify(billData.lineItems)}` : ''}

Provide your analysis in the following JSON format:
{
    "summary": "A brief 2-3 sentence summary of the bill analysis",
    "insights": ["insight1", "insight2", "insight3"],
    "recommendations": ["recommendation1", "recommendation2"],
    "potentialSavings": estimated_savings_in_rupees,
    "riskLevel": "low" | "medium" | "high"
}

Focus on:
1. Cost optimization opportunities
2. Power factor improvements
3. Demand management
4. Tariff optimization
5. Anomaly detection

Respond ONLY with valid JSON.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        throw new Error('Invalid response format');
    } catch (error) {
        console.error('Gemini API error:', error);
        return {
            summary: 'Unable to analyze bill at this time.',
            insights: ['AI analysis temporarily unavailable'],
            recommendations: ['Please try again later'],
            potentialSavings: 0,
            riskLevel: 'low',
        };
    }
}

/**
 * Legacy function - kept for backward compatibility
 */
export async function extractBillFromImage(
    imageBase64: string,
    mimeType: string
): Promise<ExtractedBillData | null> {
    const result = await scanBillWithVLM(imageBase64, mimeType);
    return result.extractedData;
}

/**
 * Get smart insights from conversational query
 */
export async function getSmartInsights(query: string, context?: string): Promise<string> {
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-001',
        safetySettings,
    });

    const prompt = `You are BillOS AI, an intelligent assistant for electricity bill management in India. You help users understand their bills, find savings, and optimize energy consumption.

${context ? `Context: ${context}` : ''}

User Query: ${query}

Provide a helpful, concise response focused on actionable insights. If the query is about electricity bills, tariffs, or energy management, provide specific advice relevant to Indian DISCOMs and regulations.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini API error:', error);
        return 'I apologize, but I\'m unable to process your request at the moment. Please try again later.';
    }
}

/**
 * Generate summary from bill text (OCR result)
 */
export async function generateBillSummary(billText: string): Promise<{
    extractedData: Record<string, unknown>;
    summary: string;
}> {
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-001',
        safetySettings,
    });

    const prompt = `Extract structured data from this electricity bill text and provide a summary:

Bill Text:
${billText}

Respond in JSON format:
{
    "extractedData": {
        "consumerNumber": "",
        "billDate": "",
        "dueDate": "",
        "totalAmount": 0,
        "unitsConsumed": 0,
        "discom": "",
        "tariffCategory": ""
    },
    "summary": "Brief summary of the bill"
}

Respond ONLY with valid JSON.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        throw new Error('Invalid response format');
    } catch (error) {
        console.error('Gemini API error:', error);
        return {
            extractedData: {},
            summary: 'Unable to extract data from bill.',
        };
    }
}

/**
 * Check if Gemini is configured
 */
export function isGeminiConfigured(): boolean {
    return !!(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY);
}
