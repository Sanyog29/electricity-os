'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { fetchUserBills, saveBillToDatabase, deleteBill as deleteBillFromDb, BillRecord, CreateBillInput } from '@/lib/supabase/bills';
import { isDemoMode } from '@/lib/supabase/client';

export interface StoredBill {
    id: string;
    fileName: string;
    fileUrl?: string;
    uploadDate: Date;
    site: string;
    month: string;
    totalAmount: number;
    unitsConsumed: number;
    maxDemand?: number;
    powerFactor?: number;
    status: 'processing' | 'analyzed' | 'audited';
    insights: {
        summary: string;
        insights: string[];
        recommendations: string[];
        potentialSavings: number;
        riskLevel: 'low' | 'medium' | 'high';
    };
}

// Analytics types
export interface MonthlyTrendPoint {
    name: string;
    value: number;
    cost: number;
}

export interface SiteComparisonPoint {
    name: string;
    value: number;
    value2?: number;
    color?: string;
    [key: string]: string | number | undefined;
}

export interface SiteAnalytics {
    siteId: string;
    siteName: string;
    totalCost: number;
    totalConsumption: number;
    billCount: number;
    avgPowerFactor: number;
    potentialSavings: number;
    trend: 'up' | 'down' | 'stable';
}

interface BillContextType {
    bills: StoredBill[];
    loading: boolean;
    addBill: (bill: StoredBill, file?: File) => Promise<void>;
    getBill: (id: string) => StoredBill | undefined;
    updateBill: (id: string, updates: Partial<StoredBill>) => void;
    deleteBill: (id: string) => Promise<void>;
    refreshBills: () => Promise<void>;
    totalSavings: number;
    totalConsumption: number;
    totalCost: number;
    // Analytics functions
    getMonthlyTrend: () => MonthlyTrendPoint[];
    getSiteComparison: () => SiteComparisonPoint[];
    getCostBySite: () => SiteComparisonPoint[];
    getSiteAnalytics: () => SiteAnalytics[];
    getUniqueSites: () => string[];
}

const BillContext = createContext<BillContextType | undefined>(undefined);

// Convert database record to StoredBill
function recordToStoredBill(record: BillRecord): StoredBill {
    const parsedData = record.parsed_data || {};
    return {
        id: record.id,
        fileName: record.file_name,
        fileUrl: record.file_url || undefined,
        uploadDate: new Date(record.created_at),
        site: parsedData.site_name || 'Unknown Site',
        month: record.bill_month,
        totalAmount: Number(record.total_amount),
        unitsConsumed: Number(record.units_consumed_kwh),
        maxDemand: record.max_demand_kva ? Number(record.max_demand_kva) : undefined,
        powerFactor: record.power_factor ? Number(record.power_factor) : undefined,
        status: record.status === 'processed' ? 'analyzed' : record.status === 'audited' ? 'audited' : 'processing',
        insights: {
            summary: parsedData.insights_summary || '',
            insights: parsedData.insights_list || [],
            recommendations: parsedData.recommendations || [],
            potentialSavings: parsedData.potential_savings || 0,
            riskLevel: parsedData.risk_level || 'low',
        },
    };
}

export function BillProvider({ children }: { children: ReactNode }) {
    const [bills, setBills] = useState<StoredBill[]>([]);
    const [loading, setLoading] = useState(true);

    // Load bills from database on mount
    useEffect(() => {
        loadBills();
    }, []);

    const loadBills = async () => {
        setLoading(true);
        try {
            const records = await fetchUserBills();
            const storedBills = records.map(recordToStoredBill);
            setBills(storedBills);
        } catch (error) {
            console.error('Error loading bills:', error);
        } finally {
            setLoading(false);
        }
    };

    const addBill = async (bill: StoredBill, file?: File) => {
        // Always add to local state first for immediate UI update
        setBills(prev => [bill, ...prev]);

        // Try to save to database if not in demo mode
        if (!isDemoMode() && file) {
            try {
                const input: CreateBillInput = {
                    fileName: bill.fileName,
                    fileBlob: file,
                    siteName: bill.site,
                    billMonth: bill.month,
                    totalAmount: bill.totalAmount,
                    unitsConsumed: bill.unitsConsumed,
                    maxDemand: bill.maxDemand,
                    powerFactor: bill.powerFactor,
                    insights: bill.insights,
                };

                const savedRecord = await saveBillToDatabase(input);

                if (savedRecord) {
                    // Update the local bill with the database ID and file URL
                    setBills(prev => prev.map(b =>
                        b.id === bill.id
                            ? { ...b, id: savedRecord.id, fileUrl: savedRecord.file_url || undefined }
                            : b
                    ));
                }
            } catch (error) {
                console.error('Error saving bill to database:', error);
            }
        }
    };

    const getBill = (id: string) => {
        return bills.find(b => b.id === id);
    };

    const updateBill = (id: string, updates: Partial<StoredBill>) => {
        setBills(prev => prev.map(b =>
            b.id === id ? { ...b, ...updates } : b
        ));
    };

    const deleteBillFn = async (id: string) => {
        // Remove from local state first
        setBills(prev => prev.filter(b => b.id !== id));

        // Try to delete from database
        if (!isDemoMode()) {
            await deleteBillFromDb(id);
        }
    };

    const refreshBills = async () => {
        await loadBills();
    };

    const totalSavings = bills.reduce((sum, b) => sum + b.insights.potentialSavings, 0);
    const totalConsumption = bills.reduce((sum, b) => sum + b.unitsConsumed, 0);
    const totalCost = bills.reduce((sum, b) => sum + b.totalAmount, 0);

    // Analytics functions with memoization
    const getUniqueSites = useMemo(() => () => {
        const sites = new Set(bills.map(b => b.site));
        return Array.from(sites);
    }, [bills]);

    const getMonthlyTrend = useMemo(() => (): MonthlyTrendPoint[] => {
        // Group bills by month
        const monthlyData = new Map<string, { consumption: number; cost: number }>();

        bills.forEach(bill => {
            const key = bill.month;
            const existing = monthlyData.get(key) || { consumption: 0, cost: 0 };
            monthlyData.set(key, {
                consumption: existing.consumption + bill.unitsConsumed,
                cost: existing.cost + bill.totalAmount
            });
        });

        // Sort by month and return last 6 months
        return Array.from(monthlyData.entries())
            .map(([name, data]) => ({
                name,
                value: data.consumption,
                cost: data.cost
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
            .slice(-6);
    }, [bills]);

    const getSiteComparison = useMemo(() => (): SiteComparisonPoint[] => {
        const siteData = new Map<string, { consumption: number; cost: number }>();

        bills.forEach(bill => {
            const existing = siteData.get(bill.site) || { consumption: 0, cost: 0 };
            siteData.set(bill.site, {
                consumption: existing.consumption + bill.unitsConsumed,
                cost: existing.cost + bill.totalAmount
            });
        });

        const colors = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
        return Array.from(siteData.entries())
            .map(([name, data], index) => ({
                name,
                value: data.consumption,
                value2: data.cost,
                color: colors[index % colors.length]
            }))
            .sort((a, b) => b.value - a.value);
    }, [bills]);

    const getCostBySite = useMemo(() => (): SiteComparisonPoint[] => {
        const siteData = new Map<string, number>();

        bills.forEach(bill => {
            const existing = siteData.get(bill.site) || 0;
            siteData.set(bill.site, existing + bill.totalAmount);
        });

        const colors = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
        return Array.from(siteData.entries())
            .map(([name, value], index) => ({
                name,
                value,
                color: colors[index % colors.length]
            }))
            .sort((a, b) => b.value - a.value);
    }, [bills]);

    const getSiteAnalytics = useMemo(() => (): SiteAnalytics[] => {
        const siteMap = new Map<string, {
            bills: StoredBill[];
            totalCost: number;
            totalConsumption: number;
            totalPF: number;
            pfCount: number;
            potentialSavings: number;
        }>();

        bills.forEach(bill => {
            const existing = siteMap.get(bill.site) || {
                bills: [],
                totalCost: 0,
                totalConsumption: 0,
                totalPF: 0,
                pfCount: 0,
                potentialSavings: 0
            };

            existing.bills.push(bill);
            existing.totalCost += bill.totalAmount;
            existing.totalConsumption += bill.unitsConsumed;
            existing.potentialSavings += bill.insights.potentialSavings;

            if (bill.powerFactor) {
                existing.totalPF += bill.powerFactor;
                existing.pfCount += 1;
            }

            siteMap.set(bill.site, existing);
        });

        return Array.from(siteMap.entries()).map(([siteName, data]) => {
            // Determine trend based on last 2 bills
            const sortedBills = data.bills.sort((a, b) =>
                a.month.localeCompare(b.month)
            );
            let trend: 'up' | 'down' | 'stable' = 'stable';
            if (sortedBills.length >= 2) {
                const last = sortedBills[sortedBills.length - 1].totalAmount;
                const prev = sortedBills[sortedBills.length - 2].totalAmount;
                if (last > prev * 1.05) trend = 'up';
                else if (last < prev * 0.95) trend = 'down';
            }

            return {
                siteId: siteName.toLowerCase().replace(/\s+/g, '-'),
                siteName,
                totalCost: data.totalCost,
                totalConsumption: data.totalConsumption,
                billCount: data.bills.length,
                avgPowerFactor: data.pfCount > 0 ? data.totalPF / data.pfCount : 0,
                potentialSavings: data.potentialSavings,
                trend
            };
        }).sort((a, b) => b.totalCost - a.totalCost);
    }, [bills]);

    return (
        <BillContext.Provider value={{
            bills,
            loading,
            addBill,
            getBill,
            updateBill,
            deleteBill: deleteBillFn,
            refreshBills,
            totalSavings,
            totalConsumption,
            totalCost,
            getMonthlyTrend,
            getSiteComparison,
            getCostBySite,
            getSiteAnalytics,
            getUniqueSites,
        }}>
            {children}
        </BillContext.Provider>
    );
}

export function useBills() {
    const context = useContext(BillContext);
    if (context === undefined) {
        throw new Error('useBills must be used within a BillProvider');
    }
    return context;
}
