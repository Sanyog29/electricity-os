import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiResponses } from './response';
import { ApiError, toApiError } from './errors';

/**
 * Authenticated user context
 */
export interface AuthContext {
    userId: string;
    email: string;
    userMetadata?: Record<string, unknown>;
}

/**
 * Generic route context - allows any params structure
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RouteContext = { params?: any };

/**
 * Request handler with auth context
 */
export type AuthenticatedHandler<T extends RouteContext = RouteContext> = (
    request: NextRequest,
    context: T,
    auth: AuthContext
) => Promise<NextResponse>;

/**
 * Higher-order function to wrap route handlers with authentication
 * 
 * Usage:
 * ```ts
 * export const GET = withAuth(async (req, ctx, auth) => {
 *   // auth.userId is guaranteed to exist here
 *   return successResponse({ user: auth.userId });
 * });
 * ```
 */
export function withAuth<T extends RouteContext = RouteContext>(handler: AuthenticatedHandler<T>) {
    return async (
        request: NextRequest,
        context: T
    ): Promise<NextResponse> => {
        try {
            const supabase = await createClient();

            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                return ApiResponses.unauthorized();
            }

            const authContext: AuthContext = {
                userId: user.id,
                email: user.email || '',
                userMetadata: user.user_metadata,
            };

            return await handler(request, context, authContext);
        } catch (error) {
            console.error('Auth middleware error:', error);

            if (error instanceof ApiError) {
                return ApiResponses.badRequest(error.message, error.details);
            }

            const apiError = toApiError(error);
            return ApiResponses.serverError(apiError);
        }
    };
}

/**
 * Optional auth - returns null auth context if not authenticated
 */
export type OptionalAuthHandler<T extends RouteContext = RouteContext> = (
    request: NextRequest,
    context: T,
    auth: AuthContext | null
) => Promise<NextResponse>;

export function withOptionalAuth<T extends RouteContext = RouteContext>(handler: OptionalAuthHandler<T>) {
    return async (
        request: NextRequest,
        context: T
    ): Promise<NextResponse> => {
        try {
            const supabase = await createClient();

            const { data: { user } } = await supabase.auth.getUser();

            const authContext: AuthContext | null = user ? {
                userId: user.id,
                email: user.email || '',
                userMetadata: user.user_metadata,
            } : null;

            return await handler(request, context, authContext);
        } catch (error) {
            console.error('Optional auth middleware error:', error);

            if (error instanceof ApiError) {
                return ApiResponses.badRequest(error.message, error.details);
            }

            const apiError = toApiError(error);
            return ApiResponses.serverError(apiError);
        }
    };
}

/**
 * Extract and validate request body as JSON
 */
export async function getRequestBody<T>(request: NextRequest): Promise<T | null> {
    try {
        const body = await request.json();
        return body as T;
    } catch {
        return null;
    }
}

/**
 * Get query parameters from request
 */
export function getQueryParams(request: NextRequest): URLSearchParams {
    return new URL(request.url).searchParams;
}

/**
 * Parse pagination parameters from query string
 */
export function getPaginationParams(request: NextRequest): { page: number; limit: number } {
    const params = getQueryParams(request);

    const page = Math.max(1, parseInt(params.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(params.get('limit') || '20', 10)));

    return { page, limit };
}
