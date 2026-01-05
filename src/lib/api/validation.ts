/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
    if (typeof input !== 'string') return '';

    return input
        .trim()
        .replace(/[<>]/g, '') // Remove angle brackets
        .slice(0, 10000); // Limit length
}

/**
 * Sanitize object values recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            sanitized[key] = sanitizeString(value);
        } else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            sanitized[key] = sanitizeObject(value as Record<string, unknown>);
        } else if (Array.isArray(value)) {
            sanitized[key] = value.map(item =>
                typeof item === 'string'
                    ? sanitizeString(item)
                    : typeof item === 'object' && item !== null
                        ? sanitizeObject(item as Record<string, unknown>)
                        : item
            );
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized as T;
}

/**
 * Validate UUID format
 */
export function isValidUUID(id: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
}

/**
 * Parse and validate a numeric query parameter
 */
export function parseNumericParam(
    value: string | null,
    defaultValue: number,
    min?: number,
    max?: number
): number {
    if (!value) return defaultValue;

    const parsed = Number(value);
    if (isNaN(parsed)) return defaultValue;

    let result = parsed;
    if (min !== undefined) result = Math.max(min, result);
    if (max !== undefined) result = Math.min(max, result);

    return result;
}

/**
 * Parse date string and validate
 */
export function parseDate(value: string | null): Date | null {
    if (!value) return null;

    const date = new Date(value);
    if (isNaN(date.getTime())) return null;

    return date;
}

/**
 * Validate bill month format (YYYY-MM)
 */
export function isValidBillMonth(value: string): boolean {
    const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
    return regex.test(value);
}

/**
 * Escape special characters for SQL LIKE queries
 */
export function escapeLikePattern(pattern: string): string {
    return pattern
        .replace(/\\/g, '\\\\')
        .replace(/%/g, '\\%')
        .replace(/_/g, '\\_');
}

/**
 * Build database filter object from query params
 */
export function buildFilters(params: URLSearchParams): Record<string, unknown> {
    const filters: Record<string, unknown> = {};

    const allowedFilters = ['site_id', 'status', 'bill_month', 'site_type'];

    for (const key of allowedFilters) {
        const value = params.get(key);
        if (value) {
            filters[key] = sanitizeString(value);
        }
    }

    return filters;
}
