import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

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
    lineItems: Array<{
        description: string;
        amount: number;
    }>;
}

export async function analyzeBill(billData: BillData): Promise<InsightResponse> {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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

        // Parse JSON from response
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

export async function extractBillFromImage(imageBase64: string, mimeType: string): Promise<ExtractedBillData | null> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are an expert at reading Indian electricity bills. Extract all the key information from this electricity bill image.

Return the data in this exact JSON format:
{
    "consumerNumber": "string",
    "meterNumber": "string", 
    "billDate": "YYYY-MM-DD",
    "dueDate": "YYYY-MM-DD",
    "billingPeriod": "string like 'Nov 2024' or 'November 2024'",
    "totalAmount": number,
    "unitsConsumed": number,
    "previousReading": number,
    "currentReading": number,
    "maxDemand": number or 0,
    "powerFactor": number between 0 and 1,
    "discom": "MSEDCL, BESCOM, TATA Power, etc.",
    "tariffCategory": "LT/HT category",
    "address": "consumer address",
    "lineItems": [
        {"description": "Energy Charges", "amount": number},
        {"description": "Fixed Charges", "amount": number}
    ]
}

If any field cannot be determined, use reasonable defaults (0 for numbers, empty string for text).
Respond ONLY with valid JSON.`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: mimeType,
                    data: imageBase64,
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return null;
    } catch (error) {
        console.error('Gemini Vision OCR error:', error);
        return null;
    }
}

export async function getSmartInsights(query: string, context?: string): Promise<string> {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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

export async function generateBillSummary(billText: string): Promise<{
    extractedData: Record<string, any>;
    summary: string;
}> {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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

// Check if Gemini is configured
export function isGeminiConfigured(): boolean {
    return !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;
}
