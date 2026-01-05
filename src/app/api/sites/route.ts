import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
    withAuth,
    AuthContext,
    getRequestBody,
    getPaginationParams,
    successResponse,
    paginatedResponse,
    ApiResponses,
    siteSchema,
    validateInput,
    formatValidationErrors,
    sanitizeObject,
} from '@/lib/api';

/**
 * GET /api/sites
 * List all sites for the authenticated user
 */
export const GET = withAuth(async (request: NextRequest, _ctx, auth: AuthContext) => {
    const { page, limit } = getPaginationParams(request);
    const offset = (page - 1) * limit;

    const supabase = await createClient();

    // Get total count
    const { count, error: countError } = await supabase
        .from('sites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', auth.userId);

    if (countError) {
        console.error('Count error:', countError);
        return ApiResponses.serverError();
    }

    // Get paginated sites
    const { data: sites, error } = await supabase
        .from('sites')
        .select('*')
        .eq('user_id', auth.userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        console.error('Sites fetch error:', error);
        return ApiResponses.serverError();
    }

    return paginatedResponse(sites || [], page, limit, count || 0);
});

/**
 * POST /api/sites
 * Create a new site
 */
export const POST = withAuth(async (request: NextRequest, _ctx, auth: AuthContext) => {
    const body = await getRequestBody(request);

    if (!body) {
        return ApiResponses.badRequest('Invalid JSON body');
    }

    // Sanitize and validate input
    const sanitized = sanitizeObject(body as Record<string, unknown>);
    const validation = validateInput(siteSchema, sanitized);

    if (!validation.success) {
        return ApiResponses.validationError(formatValidationErrors(validation.errors));
    }

    const supabase = await createClient();

    // Create site with user_id
    const { data: site, error } = await supabase
        .from('sites')
        .insert({
            ...validation.data,
            user_id: auth.userId,
        })
        .select()
        .single();

    if (error) {
        console.error('Site creation error:', error);
        if (error.code === '23505') {
            return ApiResponses.badRequest('A site with this name already exists');
        }
        return ApiResponses.serverError();
    }

    return ApiResponses.created(site);
});
