'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchUserSites, saveSiteToDatabase, deleteSiteFromDb, SiteRecord, CreateSiteInput } from '@/lib/supabase/sites';
import { isDemoMode } from '@/lib/supabase/client';

export interface Site {
    id: string;
    name: string;
    address: string;
    state: string;
    type: 'office' | 'factory' | 'warehouse' | 'retail' | 'residential';
    discom: string;
    meters: number;
    createdAt: Date;
}

interface SiteContextType {
    sites: Site[];
    loading: boolean;
    addSite: (site: Site) => Promise<void>;
    getSite: (id: string) => Site | undefined;
    updateSite: (id: string, updates: Partial<Site>) => void;
    deleteSite: (id: string) => Promise<void>;
    refreshSites: () => Promise<void>;
    totalMeters: number;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

// Convert database record to Site
function recordToSite(record: SiteRecord): Site {
    return {
        id: record.id,
        name: record.name,
        address: record.address || '',
        state: record.state || '',
        type: (record.site_type as Site['type']) || 'office',
        discom: '', // Not stored in current schema
        meters: 1, // Default
        createdAt: new Date(record.created_at),
    };
}

export function SiteProvider({ children }: { children: ReactNode }) {
    const [sites, setSites] = useState<Site[]>([]);
    const [loading, setLoading] = useState(true);

    // Load sites from database on mount
    useEffect(() => {
        loadSites();
    }, []);

    const loadSites = async () => {
        setLoading(true);
        try {
            const records = await fetchUserSites();
            const loadedSites = records.map(recordToSite);
            setSites(loadedSites);
        } catch (error) {
            console.error('Error loading sites:', error);
        } finally {
            setLoading(false);
        }
    };

    const addSite = async (site: Site) => {
        // Always add to local state first for immediate UI update
        setSites(prev => [site, ...prev]);

        // Try to save to database if not in demo mode
        if (!isDemoMode()) {
            try {
                const input: CreateSiteInput = {
                    name: site.name,
                    address: site.address,
                    state: site.state,
                    siteType: site.type,
                    discom: site.discom,
                    meters: site.meters,
                };

                const savedRecord = await saveSiteToDatabase(input);

                if (savedRecord) {
                    // Update the local site with the database ID
                    setSites(prev => prev.map(s =>
                        s.id === site.id
                            ? { ...s, id: savedRecord.id }
                            : s
                    ));
                }
            } catch (error) {
                console.error('Error saving site to database:', error);
            }
        }
    };

    const getSite = (id: string) => {
        return sites.find(s => s.id === id);
    };

    const updateSite = (id: string, updates: Partial<Site>) => {
        setSites(prev => prev.map(s =>
            s.id === id ? { ...s, ...updates } : s
        ));
    };

    const deleteSiteFn = async (id: string) => {
        // Remove from local state first
        setSites(prev => prev.filter(s => s.id !== id));

        // Try to delete from database
        if (!isDemoMode()) {
            await deleteSiteFromDb(id);
        }
    };

    const refreshSites = async () => {
        await loadSites();
    };

    const totalMeters = sites.reduce((sum, s) => sum + s.meters, 0);

    return (
        <SiteContext.Provider value={{
            sites,
            loading,
            addSite,
            getSite,
            updateSite,
            deleteSite: deleteSiteFn,
            refreshSites,
            totalMeters,
        }}>
            {children}
        </SiteContext.Provider>
    );
}

export function useSites() {
    const context = useContext(SiteContext);
    if (context === undefined) {
        throw new Error('useSites must be used within a SiteProvider');
    }
    return context;
}
