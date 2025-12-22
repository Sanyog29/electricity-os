import { createBrowserClient } from '@supabase/ssr';

// Create a mock client for demo mode when Supabase is not configured
const mockClient = {
    auth: {
        signInWithPassword: async () => ({ error: { message: 'Supabase not configured' } }),
        signUp: async () => ({ error: { message: 'Supabase not configured' } }),
        signOut: async () => ({ error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
    },
    from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null }),
    }),
    storage: {
        from: () => ({
            upload: async () => ({ data: null, error: { message: 'mode' } }),
            getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
    },
};

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Return mock client if not configured
    if (!supabaseUrl || !supabaseKey) {
        console.warn('Supabase not configured - using mock client');
        return mockClient as any;
    }

    return createBrowserClient(supabaseUrl, supabaseKey);
}

// Check if we're in demo mode
export function isDemoMode() {
    return !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}
