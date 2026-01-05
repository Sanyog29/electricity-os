import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
    withAuth,
    AuthContext,
    getRequestBody,
    getPaginationParams,
    getQueryParams,
    successResponse,
    paginatedResponse,
    ApiResponses,
    billSchema,
    validateInput,
    formatValidationErrors,
    sanitizeObject,
    buildFilters,
} from '@/lib/api';

/**
 * GET /api/bills
 * List all bills for the authenticated user
 */
export const GET = withAuth(async (request: NextRequest, _ctx, auth: AuthContext) => {
    const { page, limit } = getPaginationParams(request);
    const offset = (page - 1) * limit;
    const params = getQueryParams(request);
    const filters = buildFilters(params);

    const supabase = await createClient();

    // Build query
    let query = supabase
        .from('bills')
        .select('*', { count: 'exact' })
        .eq('user_id', auth.userId);

    // Apply filters
    if (filters.site_id) {
        query = query.eq('site_id', filters.site_id);
    }
    if (filters.status) {
        query = query.eq('status', filters.status);
    }
    if (filters.bill_month) {
        query = query.eq('bill_month', filters.bill_month);
    }

    // Get total count
    const { count, error: countError } = await query;

    if (countError) {
        console.error('Count error:', countError);
        return ApiResponses.serverError();
    }

    // Get paginated bills
    const { data: bills, error } = await supabase
        .from('bills')
        .select('*')
        .eq('user_id', auth.userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        console.error('Bills fetch error:', error);
        return ApiResponses.serverError();
    }

    return paginatedResponse(bills || [], page, limit, count || 0);
});

/**
 * POST /api/bills
 * Create a new bill
 */
export const POST = withAuth(async (request: NextRequest, _ctx, auth: AuthContext) => {
    const body = await getRequestBody(request);

    if (!body) {
        return ApiResponses.badRequest('Invalid JSON body');
    }

    // Sanitize and validate input
    const sanitized = sanitizeObject(body as Record<string, unknown>);
    const validation = validateInput(billSchema, sanitized);

    if (!validation.success) {
        return ApiResponses.validationError(formatValidationErrors(validation.errors));
    }

    const supabase = await createClient();

    // Create bill with user_id
    const { data: bill, error } = await supabase
        .from('bills')
        .insert({
            ...validation.data,
            user_id: auth.userId,
            status: 'uploaded',
        })
        .select()
        .single();

    if (error) {
        console.error('Bill creation error:', error);
        return ApiResponses.serverError();
    }

    return ApiResponses.created(bill);
});
