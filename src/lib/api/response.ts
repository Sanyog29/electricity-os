import { NextResponse } from 'next/server';

/**
 * Standard API response structure
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: unknown;
    };
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        timestamp?: string;
    };
}

/**
 * Create a successful JSON response
 */
export function successResponse<T>(
    data: T,
    meta?: ApiResponse['meta'],
    status = 200
): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
        {
            success: true,
            data,
            meta: {
                ...meta,
                timestamp: new Date().toISOString(),
            },
        },
        { status }
    );
}

/**
 * Create an error JSON response
 */
export function errorResponse(
    code: string,
    message: string,
    status = 400,
    details?: unknown
): NextResponse<ApiResponse<never>> {
    const errorObj: { code: string; message: string; details?: unknown } = {
        code,
        message,
    };
    if (details !== undefined) {
        errorObj.details = details;
    }

    return NextResponse.json(
        {
            success: false,
            error: errorObj,
            meta: {
                timestamp: new Date().toISOString(),
            },
        },
        { status }
    );
}

/**
 * Create a paginated response
 */
export function paginatedResponse<T>(
    data: T[],
    page: number,
    limit: number,
    total: number
): NextResponse<ApiResponse<T[]>> {
    return successResponse(data, {
        page,
        limit,
        total,
    });
}

/**
 * Common response helpers
 */
export const ApiResponses = {
    notFound: (resource = 'Resource') =>
        errorResponse('NOT_FOUND', `${resource} not found`, 404),

    unauthorized: () =>
        errorResponse('UNAUTHORIZED', 'Authentication required', 401),

    forbidden: () =>
        errorResponse('FORBIDDEN', 'Access denied', 403),

    badRequest: (message: string, details?: unknown) =>
        errorResponse('BAD_REQUEST', message, 400, details),

    validationError: (details: unknown) =>
        errorResponse('VALIDATION_ERROR', 'Invalid request data', 422, details),

    serverError: (error?: Error) =>
        errorResponse(
            'INTERNAL_ERROR',
            'An unexpected error occurred',
            500,
            process.env.NODE_ENV === 'development' ? error?.message : undefined
        ),

    created: <T>(data: T) => successResponse(data, undefined, 201),

    deleted: () => successResponse({ deleted: true }),

    noContent: () => new NextResponse(null, { status: 204 }),
};
