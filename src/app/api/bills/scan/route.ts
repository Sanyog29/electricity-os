import { NextRequest } from 'next/server';
import { scanBillWithFallback, isVLMAvailable, getProvidersStatus } from '@/lib/vlm';
import { successResponse, ApiResponses } from '@/lib/api';

// Max file size: 15MB
const MAX_FILE_SIZE = 15 * 1024 * 1024;

// Allowed MIME types for bill upload
const ALLOWED_MIME_TYPES = [
    // Images
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
    // Documents
    'application/pdf',
    // Text
    'text/plain',
];

/**
 * POST /api/bills/scan
 * Scan an uploaded bill file using VLM (Ollama or Gemini)
 * Supports: JPG, PNG, PDF, TXT
 */
export async function POST(request: NextRequest) {
    try {
        // Check if any VLM provider is available
        if (!(await isVLMAvailable())) {
            return ApiResponses.badRequest(
                'No AI service available. Please configure Ollama or set GEMINI_API_KEY.'
            );
        }

        // Parse multipart form data
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return ApiResponses.badRequest('No file provided');
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return ApiResponses.badRequest(
                `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`
            );
        }

        // Validate MIME type
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            return ApiResponses.badRequest(
                `Unsupported file type: ${file.type}. Supported types: JPG, PNG, WebP, PDF, TXT`
            );
        }

        let fileContent: string;

        // Handle text files differently - read as string
        if (file.type === 'text/plain') {
            fileContent = await file.text();
        } else {
            // Convert binary files to base64
            const arrayBuffer = await file.arrayBuffer();
            fileContent = Buffer.from(arrayBuffer).toString('base64');
        }

        // Scan the bill with VLM provider (auto-fallback enabled)
        const result = await scanBillWithFallback(fileContent, file.type);

        if (!result.success) {
            // Include warnings in error message for better debugging
            const warningText = result.warnings?.length
                ? ` Warnings: ${result.warnings.join('; ')}`
                : '';
            return ApiResponses.badRequest(
                `Failed to scan bill.${warningText}`,
                { warnings: result.warnings }
            );
        }

        return successResponse({
            extractedData: result.extractedData,
            insights: result.insights,
            confidence: result.confidence,
            warnings: result.warnings,
            provider: result.provider,
            fileType: file.type,
        });
    } catch (error) {
        console.error('Bill scan error:', error);
        return ApiResponses.serverError(error instanceof Error ? error : undefined);
    }
}

/**
 * GET /api/bills/scan
 * Check if bill scanning is available and get supported formats
 */
export async function GET() {
    const status = await getProvidersStatus();

    return successResponse({
        available: status.activeProvider !== null,
        activeProvider: status.activeProvider,
        providers: status.providers,
        supportedFormats: {
            images: ['JPEG', 'PNG', 'WebP', 'HEIC'],
            documents: ['PDF'],
            text: ['TXT'],
        },
        maxFileSize: MAX_FILE_SIZE,
        maxFileSizeMB: MAX_FILE_SIZE / 1024 / 1024,
    });
}
