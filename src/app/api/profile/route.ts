import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
    withAuth,
    AuthContext,
    getRequestBody,
    successResponse,
    ApiResponses,
    profileSchema,
    validateInput,
    formatValidationErrors,
    sanitizeObject,
} from '@/lib/api';

/**
 * GET /api/profile
 * Get the authenticated user's profile
 */
export const GET = withAuth(async (_request: NextRequest, _ctx, auth: AuthContext) => {
    const supabase = await createClient();

    // Get user profile from users table
    const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', auth.userId)
        .single();

    if (error) {
        console.error('Profile fetch error:', error);

        // If user doesn't exist in users table, return basic auth info
        if (error.code === 'PGRST116') {
            return successResponse({
                id: auth.userId,
                email: auth.email,
                full_name: auth.userMetadata?.full_name || null,
                phone: null,
                role: 'member',
                avatar_url: null,
                created_at: new Date().toISOString(),
            });
        }

        return ApiResponses.serverError();
    }

    return successResponse(profile);
});

/**
 * PUT /api/profile
 * Update the authenticated user's profile
 */
export const PUT = withAuth(async (request: NextRequest, _ctx, auth: AuthContext) => {
    const body = await getRequestBody(request);

    if (!body) {
        return ApiResponses.badRequest('Invalid JSON body');
    }

    // Sanitize and validate input
    const sanitized = sanitizeObject(body as Record<string, unknown>);
    const validation = validateInput(profileSchema, sanitized);

    if (!validation.success) {
        return ApiResponses.validationError(formatValidationErrors(validation.errors));
    }

    const supabase = await createClient();

    // Extract profile and organization fields
    const { organization_name, organization_industry, organization_gst, ...profileData } = validation.data;

    // Upsert user profile
    const { data: profile, error } = await supabase
        .from('users')
        .upsert({
            id: auth.userId,
            email: auth.email,
            ...profileData,
            updated_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) {
        console.error('Profile update error:', error);
        return ApiResponses.serverError();
    }

    // If organization data provided and user has an organization, update it
    if ((organization_name || organization_industry || organization_gst) && profile.organization_id) {
        const orgUpdate: Record<string, string> = {};
        if (organization_name) orgUpdate.name = organization_name;
        if (organization_industry) orgUpdate.industry = organization_industry;
        if (organization_gst) orgUpdate.gst_number = organization_gst;

        const { error: orgError } = await supabase
            .from('organizations')
            .update(orgUpdate)
            .eq('id', profile.organization_id);

        if (orgError) {
            console.error('Organization update error:', orgError);
            // Don't fail the request, profile was updated
        }
    }

    return successResponse(profile);
});
