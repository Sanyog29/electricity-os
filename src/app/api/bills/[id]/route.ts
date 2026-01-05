import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
    withAuth,
    AuthContext,
    getRequestBody,
    successResponse,
    ApiResponses,
    billSchema,
    validateInput,
    formatValidationErrors,
    sanitizeObject,
    isValidUUID,
} from '@/lib/api';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/bills/[id]
 * Get a single bill by ID
 */
export const GET = withAuth(async (_request: NextRequest, ctx: RouteContext, auth: AuthContext) => {
    const { id } = await ctx.params;

    if (!isValidUUID(id)) {
        return ApiResponses.badRequest('Invalid bill ID format');
    }

    const supabase = await createClient();

    const { data: bill, error } = await supabase
        .from('bills')
        .select('*')
        .eq('id', id)
        .eq('user_id', auth.userId)
        .single();

    if (error || !bill) {
        return ApiResponses.notFound('Bill');
    }

    return successResponse(bill);
});

/**
 * PUT /api/bills/[id]
 * Update a bill
 */
export const PUT = withAuth(async (request: NextRequest, ctx: RouteContext, auth: AuthContext) => {
    const { id } = await ctx.params;

    if (!isValidUUID(id)) {
        return ApiResponses.badRequest('Invalid bill ID format');
    }

    const body = await getRequestBody(request);

    if (!body) {
        return ApiResponses.badRequest('Invalid JSON body');
    }

    // Validate partial update
    const sanitized = sanitizeObject(body as Record<string, unknown>);
    const validation = validateInput(billSchema.partial(), sanitized);

    if (!validation.success) {
        return ApiResponses.validationError(formatValidationErrors(validation.errors));
    }

    const supabase = await createClient();

    // Update bill
    const { data: bill, error } = await supabase
        .from('bills')
        .update({
            ...validation.data,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', auth.userId)
        .select()
        .single();

    if (error) {
        console.error('Bill update error:', error);
        return ApiResponses.serverError();
    }

    if (!bill) {
        return ApiResponses.notFound('Bill');
    }

    return successResponse(bill);
});

/**
 * DELETE /api/bills/[id]
 * Delete a bill
 */
export const DELETE = withAuth(async (_request: NextRequest, ctx: RouteContext, auth: AuthContext) => {
    const { id } = await ctx.params;

    if (!isValidUUID(id)) {
        return ApiResponses.badRequest('Invalid bill ID format');
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from('bills')
        .delete()
        .eq('id', id)
        .eq('user_id', auth.userId);

    if (error) {
        console.error('Bill deletion error:', error);
        return ApiResponses.serverError();
    }

    return ApiResponses.deleted();
});
