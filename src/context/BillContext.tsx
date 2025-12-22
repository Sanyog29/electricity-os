'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
