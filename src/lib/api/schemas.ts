import { z, ZodType, ZodIssue } from 'zod';

/**
 * Site creation/update schema
 */
export const siteSchema = z.object({
    name: z.string().min(1, 'Site name is required').max(100),
    address: z.string().max(255).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    pincode: z.string().max(10).optional(),
    site_type: z.enum(['office', 'factory', 'warehouse', 'retail', 'residential', 'hospital', 'hotel', 'other']).optional(),
    area_sqft: z.number().positive().optional(),
    operational_hours: z.string().max(100).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
});

export type SiteInput = z.infer<typeof siteSchema>;

/**
 * Site profile schema (enhanced site data)
 */
export const siteProfileSchema = z.object({
    // Connection Details
    supply_type: z.enum(['LT', 'HT', 'EHT']).optional(),
    tariff_category: z.string().max(50).optional(),
    sanctioned_load_kw: z.number().positive().optional(),
    contract_demand_kva: z.number().positive().optional(),

    // Operating Parameters
    operating_hours_per_day: z.number().min(0).max(24).optional(),
    operating_days_per_month: z.number().min(0).max(31).optional(),
    peak_usage_hours: z.string().max(100).optional(),

    // Consumption Baseline
    avg_monthly_units_kwh: z.number().positive().optional(),
    avg_monthly_cost: z.number().positive().optional(),
    power_factor_target: z.number().min(0).max(1).optional(),
});

export type SiteProfileInput = z.infer<typeof siteProfileSchema>;

/**
 * Bill creation schema
 */
export const billSchema = z.object({
    site_id: z.string().uuid().optional(),
    bill_month: z.string().regex(/^\d{4}-\d{2}$/, 'Format: YYYY-MM'),
    total_amount: z.number().positive(),
    units_consumed_kwh: z.number().min(0),
    max_demand_kva: z.number().min(0).optional(),
    power_factor: z.number().min(0).max(1).optional(),
    due_date: z.string().datetime().optional(),
    bill_date: z.string().datetime().optional(),

    // Parsed data
    parsed_data: z.record(z.string(), z.unknown()).optional(),
});

export type BillInput = z.infer<typeof billSchema>;

/**
 * User profile update schema
 */
export const profileSchema = z.object({
    full_name: z.string().min(1).max(100).optional(),
    phone: z.string().max(20).optional(),
    avatar_url: z.string().url().optional(),

    // Organization info (if owner)
    organization_name: z.string().max(100).optional(),
    organization_industry: z.string().max(100).optional(),
    organization_gst: z.string().max(20).optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

/**
 * Query filter schema for listing
 */
export const listQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    sort_by: z.string().optional(),
    sort_order: z.enum(['asc', 'desc']).default('desc'),
    search: z.string().optional(),
});

export type ListQueryInput = z.infer<typeof listQuerySchema>;

/**
 * Validate and parse input against a schema
 */
export function validateInput<T extends ZodType>(
    schema: T,
    data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: ZodIssue[] } {
    const result = schema.safeParse(data);

    if (result.success) {
        return { success: true, data: result.data };
    }

    return { success: false, errors: result.error.issues };
}

/**
 * Format Zod errors for API response
 */
export function formatValidationErrors(errors: ZodIssue[]): Record<string, string[]> {
    const formatted: Record<string, string[]> = {};

    for (const error of errors) {
        const path = error.path.join('.') || 'root';
        if (!formatted[path]) {
            formatted[path] = [];
        }
        formatted[path].push(error.message);
    }

    return formatted;
}

