/**
 * VLM Provider Factory
 * Supports Ollama (local) and Gemini (cloud) with auto-fallback
 */

import {
    VLMProvider,
    VLMProviderType,
    VLMProviderStatus,
    BillScanResult,
    ExtractedBillData,
    InsightResponse,
} from './types';
import { ollamaProvider, checkOllamaAvailability } from './ollama';
import { scanBill as geminiScanBill, generateBillInsights, isGeminiConfigured } from '../gemini/client';

/**
 * Gemini provider wrapper implementing VLMProvider interface
 */
const geminiProvider: VLMProvider = {
    name: 'gemini',
    async isAvailable(): Promise<boolean> {
        return isGeminiConfigured();
    },
    async scanBill(content: string, mimeType: string): Promise<BillScanResult> {
        const result = await geminiScanBill(content, mimeType);
        return { ...result, provider: 'gemini' };
    },
    async generateInsights(data: ExtractedBillData): Promise<InsightResponse> {
        return generateBillInsights(data);
    },
};

/**
 * Get configured VLM provider from environment
 */
export function getConfiguredProvider(): VLMProviderType {
    const provider = process.env.VLM_PROVIDER?.toLowerCase() || 'auto';
    if (provider === 'ollama' || provider === 'gemini') {
        return provider;
    }
    return 'auto'; // Default to auto-detection
}

/**
 * Get the status of all VLM providers
 */
export async function getProvidersStatus(): Promise<{
    configured: VLMProviderType;
    providers: {
        ollama: VLMProviderStatus;
        gemini: VLMProviderStatus;
    };
    activeProvider: VLMProviderType | null;
}> {
    // Check Ollama
    const ollamaStatus = await checkOllamaAvailability();
    const ollamaProviderStatus: VLMProviderStatus = {
        available: ollamaStatus.available,
        provider: 'ollama',
        model: ollamaStatus.model,
        error: ollamaStatus.error,
    };

    // Check Gemini
    const geminiAvailable = isGeminiConfigured();
    const geminiProviderStatus: VLMProviderStatus = {
        available: geminiAvailable,
        provider: 'gemini',
        model: 'gemini-2.0-flash-001',
        error: geminiAvailable ? undefined : 'GEMINI_API_KEY not configured',
    };

    const configured = getConfiguredProvider();
    let activeProvider: VLMProviderType | null = null;

    if (configured === 'ollama' && ollamaStatus.available) {
        activeProvider = 'ollama';
    } else if (configured === 'gemini' && geminiAvailable) {
        activeProvider = 'gemini';
    } else if (configured === 'auto') {
        // Auto: prefer Ollama (local), fallback to Gemini
        if (ollamaStatus.available) {
            activeProvider = 'ollama';
        } else if (geminiAvailable) {
            activeProvider = 'gemini';
        }
    }

    return {
        configured,
        providers: {
            ollama: ollamaProviderStatus,
            gemini: geminiProviderStatus,
        },
        activeProvider,
    };
}

/**
 * Get the active VLM provider based on configuration
 */
export async function getActiveProvider(): Promise<VLMProvider | null> {
    const configured = getConfiguredProvider();

    if (configured === 'gemini') {
        if (await geminiProvider.isAvailable()) {
            console.log('[VLM] Using Gemini provider (configured)');
            return geminiProvider;
        }
        console.warn('[VLM] Gemini configured but not available');
        return null;
    }

    if (configured === 'ollama') {
        if (await ollamaProvider.isAvailable()) {
            console.log('[VLM] Using Ollama provider (configured)');
            return ollamaProvider;
        }
        console.warn('[VLM] Ollama configured but not available');
        return null;
    }

    // Auto mode: try Ollama first, then Gemini
    if (await ollamaProvider.isAvailable()) {
        console.log('[VLM] Using Ollama provider (auto)');
        return ollamaProvider;
    }

    if (await geminiProvider.isAvailable()) {
        console.log('[VLM] Using Gemini provider (fallback)');
        return geminiProvider;
    }

    console.warn('[VLM] No VLM provider available');
    return null;
}

/**
 * Helper to generate user-friendly error messages for Ollama failures
 */
function getOllamaErrorMessage(errorMessage: string): string {
    // Resource/memory issues
    if (errorMessage.includes('resource limitations') ||
        errorMessage.includes('model runner has unexpectedly stopped') ||
        errorMessage.includes('out of memory')) {
        return 'Ollama ran out of memory. Try using a lighter model like "moondream" (run: ollama pull moondream) or close other applications to free up RAM.';
    }

    // Connection issues
    if (errorMessage.includes('Failed to connect') ||
        errorMessage.includes('ECONNREFUSED') ||
        errorMessage.includes('fetch failed')) {
        return 'Cannot connect to Ollama. Please ensure Ollama is running (run: ollama serve).';
    }

    // Model not found
    if (errorMessage.includes('not found') ||
        errorMessage.includes('model') && errorMessage.includes('pull')) {
        const model = process.env.OLLAMA_MODEL || 'llava:7b';
        return `Model "${model}" not found. Please pull it first (run: ollama pull ${model}).`;
    }

    // Timeout issues
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
        return 'Request timed out. The model may be too slow or the image too large. Try a smaller image or lighter model.';
    }

    // API errors
    if (errorMessage.includes('API error: 500')) {
        return 'Ollama server error. Check server logs (run: ollama logs) and try restarting Ollama.';
    }

    // Default message
    return `Ollama error: ${errorMessage}. Make sure Ollama is running and has a vision model loaded.`;
}

/**
 * Scan bill using active VLM provider (with auto-fallback)
 */
export async function scanBillWithFallback(
    content: string,
    mimeType: string
): Promise<BillScanResult> {
    const provider = await getActiveProvider();

    if (!provider) {
        return {
            success: false,
            extractedData: null,
            insights: null,
            confidence: 0,
            warnings: ['No AI service available. Please configure Ollama or set GEMINI_API_KEY.'],
            provider: undefined,
        };
    }

    console.log(`[VLM] Scanning bill with ${provider.name}...`);

    try {
        const result = await provider.scanBill(content, mimeType);

        // If Ollama failed with an error, try falling back to Gemini
        if (!result.success && provider.name === 'ollama' && await geminiProvider.isAvailable()) {
            console.log('[VLM] Ollama failed, falling back to Gemini...');
            const geminiResult = await geminiProvider.scanBill(content, mimeType);
            if (geminiResult.success) {
                return geminiResult;
            }
            // Both failed, return Ollama error with enhanced message
            return {
                ...result,
                warnings: result.warnings?.map(w => getOllamaErrorMessage(w)) || ['Scan failed'],
            };
        }

        // If Ollama scan failed, provide helpful error message
        if (!result.success && provider.name === 'ollama' && result.warnings?.length) {
            return {
                ...result,
                warnings: result.warnings.map(w => getOllamaErrorMessage(w)),
            };
        }

        return result;
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        return {
            success: false,
            extractedData: null,
            insights: null,
            confidence: 0,
            warnings: [`Scan error: ${errorMsg}`],
            provider: provider.name as 'gemini' | 'ollama',
        };
    }
}

/**
 * Check if Ollama VLM is available
 */
export async function isVLMAvailable(): Promise<boolean> {
    const provider = await getActiveProvider();
    return provider !== null;
}

export { ollamaProvider };
