import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
    withAuth,
    AuthContext,
    getRequestBody,
    successResponse,
    ApiResponses,
    siteSchema,
    validateInput,
    formatValidationErrors,
    sanitizeObject,
    isValidUUID,
} from '@/lib/api';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/sites/[id]
 * Get a single site by ID
 */
export const GET = withAuth(async (_request: NextRequest, ctx: RouteContext, auth: AuthContext) => {
    const { id } = await ctx.params;

    if (!isValidUUID(id)) {
        return ApiResponses.badRequest('Invalid site ID format');
    }

    const supabase = await createClient();

    const { data: site, error } = await supabase
        .from('sites')
        .select('*')
        .eq('id', id)
        .eq('user_id', auth.userId)
        .single();

    if (error || !site) {
        return ApiResponses.notFound('Site');
    }

    return successResponse(site);
});

/**
 * PUT /api/sites/[id]
 * Update a site
 */
export const PUT = withAuth(async (request: NextRequest, ctx: RouteContext, auth: AuthContext) => {
    const { id } = await ctx.params;

    if (!isValidUUID(id)) {
        return ApiResponses.badRequest('Invalid site ID format');
    }

    const body = await getRequestBody(request);

    if (!body) {
        return ApiResponses.badRequest('Invalid JSON body');
    }

    // Validate partial update
    const sanitized = sanitizeObject(body as Record<string, unknown>);
    const validation = validateInput(siteSchema.partial(), sanitized);

    if (!validation.success) {
        return ApiResponses.validationError(formatValidationErrors(validation.errors));
    }

    const supabase = await createClient();

    // Update site
    const { data: site, error } = await supabase
        .from('sites')
        .update({
            ...validation.data,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', auth.userId)
        .select()
        .single();

    if (error) {
        console.error('Site update error:', error);
        return ApiResponses.serverError();
    }

    if (!site) {
        return ApiResponses.notFound('Site');
    }

    return successResponse(site);
});

/**
 * DELETE /api/sites/[id]
 * Delete a site
 */
export const DELETE = withAuth(async (_request: NextRequest, ctx: RouteContext, auth: AuthContext) => {
    const { id } = await ctx.params;

    if (!isValidUUID(id)) {
        return ApiResponses.badRequest('Invalid site ID format');
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from('sites')
        .delete()
        .eq('id', id)
        .eq('user_id', auth.userId);

    if (error) {
        console.error('Site deletion error:', error);
        return ApiResponses.serverError();
    }

    return ApiResponses.deleted();
});
