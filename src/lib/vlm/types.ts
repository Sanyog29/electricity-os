/**
 * VLM (Vision Language Model) Types and Interfaces
 * Shared across all VLM providers (Ollama, Gemini, etc.)
 */

// Re-export types from Gemini client for compatibility
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

export interface InsightResponse {
    summary: string;
    insights: string[];
    recommendations: string[];
    potentialSavings: number;
    riskLevel: 'low' | 'medium' | 'high';
}

export interface BillScanResult {
    success: boolean;
    extractedData: ExtractedBillData | null;
    insights: InsightResponse | null;
    confidence: number;
    warnings: string[];
    rawText?: string;
    provider?: 'gemini' | 'ollama';
}

export type VLMProviderType = 'gemini' | 'ollama' | 'auto';

export interface VLMConfig {
    provider: VLMProviderType;
    ollamaBaseUrl?: string;
    ollamaModel?: string;
    geminiApiKey?: string;
}

export interface VLMProviderStatus {
    available: boolean;
    provider: VLMProviderType;
    model?: string;
    error?: string;
}

export interface VLMProvider {
    name: VLMProviderType;
    isAvailable(): Promise<boolean>;
    scanBill(content: string, mimeType: string): Promise<BillScanResult>;
    generateInsights(data: ExtractedBillData): Promise<InsightResponse>;
}

// Default configuration
export const DEFAULT_OLLAMA_BASE_URL = 'http://localhost:11434';
export const DEFAULT_OLLAMA_MODEL = 'moondream';
