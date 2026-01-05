/**
 * VLM (Vision Language Model) Module
 * Unified interface for bill scanning with multiple providers
 */

// Export types
export type {
    ExtractedBillData,
    InsightResponse,
    BillScanResult,
    VLMProvider,
    VLMConfig,
    VLMProviderType,
    VLMProviderStatus,
} from './types';

export {
    DEFAULT_OLLAMA_BASE_URL,
    DEFAULT_OLLAMA_MODEL,
} from './types';

// Export providers
export { ollamaProvider, checkOllamaAvailability } from './ollama';
export {
    ollamaProvider as ollama,
    getActiveProvider,
    getConfiguredProvider,
    getProvidersStatus,
    scanBillWithFallback,
    isVLMAvailable,
} from './provider';

// Default export: unified scan function
export { scanBillWithFallback as scanBill } from './provider';
