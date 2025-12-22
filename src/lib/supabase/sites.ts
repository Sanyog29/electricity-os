import { createClient, isDemoMode } from './client';

export interface SiteRecord {
    id: string;
    organization_id: string | null;
    name: string;
    address: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
    site_type: string | null;
    area_sqft: number | null;
    created_at: string;
    updated_at: string;
}

export interface CreateSiteInput {
    name: string;
    address?: string;
    state?: string;
    siteType?: 'office' | 'factory' | 'warehouse' | 'retail' | 'residential';
    discom?: string;
    meters?: number;
}

// Save site record to database
export async function saveSiteToDatabase(input: CreateSiteInput): Promise<SiteRecord | null> {
    if (isDemoMode()) {
        console.log('Demo mode: Skipping database save');
        return null;
    }

    const supabase = createClient();
    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError || !userData.user) {
        console.log('User not authenticated, skipping database save');
        return null;
    }

    // Get user's organization_id from users table
    const { data: userRecord } = await supabase
        .from('users')
        .select('organization_id')
        .eq('id', userData.user.id)
        .single();

    const { data, error } = await supabase
        .from('sites')
        .insert({
            user_id: userData.user.id,
            organization_id: userRecord?.organization_id || null,
            name: input.name,
            address: input.address || null,
            state: input.state || null,
            site_type: input.siteType || null,
        })
        .select()
        .single();

    if (error) {
        console.error('Error saving site:', error.message || error.code || 'Unknown error');
        return null;
    }

    return data;
}

// Fetch all sites for current user's organization
export async function fetchUserSites(): Promise<SiteRecord[]> {
    if (isDemoMode()) {
        console.log('Demo mode: Returning empty sites');
        return [];
    }

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
        return [];
    }

    const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching sites:', error);
        return [];
    }

    return data || [];
}

// Fetch single site by ID
export async function fetchSiteById(siteId: string): Promise<SiteRecord | null> {
    if (isDemoMode()) {
        return null;
    }

    const supabase = createClient();

    const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('id', siteId)
        .single();

    if (error) {
        console.error('Error fetching site:', error);
        return null;
    }

    return data;
}

// Delete site
export async function deleteSiteFromDb(siteId: string): Promise<boolean> {
    if (isDemoMode()) {
        return false;
    }

    const supabase = createClient();

    const { error } = await supabase
        .from('sites')
        .delete()
        .eq('id', siteId);

    if (error) {
        console.error('Error deleting site:', error);
        return false;
    }

    return true;
}
