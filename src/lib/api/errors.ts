/**
 * API Error codes and their meanings
 */
export const ErrorCodes = {
    // Authentication errors (401)
    UNAUTHORIZED: 'UNAUTHORIZED',
    INVALID_TOKEN: 'INVALID_TOKEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',

    // Authorization errors (403)
    FORBIDDEN: 'FORBIDDEN',
    INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',

    // Client errors (400)
    BAD_REQUEST: 'BAD_REQUEST',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INVALID_INPUT: 'INVALID_INPUT',
    MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',

    // Not found errors (404)
    NOT_FOUND: 'NOT_FOUND',
    RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
    SITE_NOT_FOUND: 'SITE_NOT_FOUND',
    BILL_NOT_FOUND: 'BILL_NOT_FOUND',
    USER_NOT_FOUND: 'USER_NOT_FOUND',

    // Conflict errors (409)
    CONFLICT: 'CONFLICT',
    DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',

    // Server errors (500)
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * Error messages for each code
 */
export const ErrorMessages: Record<ErrorCode, string> = {
    UNAUTHORIZED: 'Authentication required',
    INVALID_TOKEN: 'Invalid authentication token',
    TOKEN_EXPIRED: 'Authentication token has expired',
    FORBIDDEN: 'Access denied',
    INSUFFICIENT_PERMISSIONS: 'You do not have permission for this action',
    BAD_REQUEST: 'Invalid request',
    VALIDATION_ERROR: 'Request validation failed',
    INVALID_INPUT: 'Invalid input provided',
    MISSING_REQUIRED_FIELD: 'Required field is missing',
    NOT_FOUND: 'Resource not found',
    RESOURCE_NOT_FOUND: 'The requested resource was not found',
    SITE_NOT_FOUND: 'Site not found',
    BILL_NOT_FOUND: 'Bill not found',
    USER_NOT_FOUND: 'User not found',
    CONFLICT: 'Resource conflict',
    DUPLICATE_ENTRY: 'A resource with this identifier already exists',
    INTERNAL_ERROR: 'An unexpected error occurred',
    DATABASE_ERROR: 'Database operation failed',
    EXTERNAL_SERVICE_ERROR: 'External service unavailable',
};

/**
 * Custom API Error class
 */
export class ApiError extends Error {
    public readonly code: ErrorCode;
    public readonly statusCode: number;
    public readonly details?: unknown;

    constructor(code: ErrorCode, message?: string, statusCode?: number, details?: unknown) {
        super(message || ErrorMessages[code]);
        this.code = code;
        this.statusCode = statusCode || ApiError.getStatusCode(code);
        this.details = details;
        this.name = 'ApiError';
    }

    private static getStatusCode(code: ErrorCode): number {
        if (code.includes('UNAUTHORIZED') || code.includes('TOKEN')) return 401;
        if (code.includes('FORBIDDEN') || code.includes('PERMISSION')) return 403;
        if (code.includes('NOT_FOUND')) return 404;
        if (code.includes('CONFLICT') || code.includes('DUPLICATE')) return 409;
        if (code.includes('VALIDATION') || code.includes('INVALID') || code.includes('MISSING')) return 422;
        if (code.includes('INTERNAL') || code.includes('DATABASE') || code.includes('EXTERNAL')) return 500;
        return 400;
    }

    toJSON(): { code: string; message: string; details?: unknown } {
        const result: { code: string; message: string; details?: unknown } = {
            code: this.code,
            message: this.message,
        };
        if (this.details !== undefined) {
            result.details = this.details;
        }
        return result;
    }
}

/**
 * Check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
}

/**
 * Wrap unknown errors into ApiError
 */
export function toApiError(error: unknown): ApiError {
    if (isApiError(error)) return error;

    if (error instanceof Error) {
        return new ApiError('INTERNAL_ERROR', error.message, 500);
    }

    return new ApiError('INTERNAL_ERROR', 'An unexpected error occurred', 500);
}
