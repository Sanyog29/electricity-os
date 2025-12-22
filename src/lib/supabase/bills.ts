import { createClient, isDemoMode } from './client';

export interface BillRecord {
    id: string;
    meter_id: string | null;
    organization_id: string | null;
    file_name: string;
    file_url: string | null;
    bill_month: string;
    total_amount: number;
    units_consumed_kwh: number;
    max_demand_kva: number | null;
    power_factor: number | null;
    status: 'uploaded' | 'processing' | 'processed' | 'audited' | 'error';
    parsed_data: {
        site_name?: string;
        insights_summary?: string;
        insights_list?: string[];
        recommendations?: string[];
        potential_savings?: number;
        risk_level?: 'low' | 'medium' | 'high';
    };
    created_at: string;
    updated_at: string;
}

export interface CreateBillInput {
    fileName: string;
    fileBlob: Blob;
    siteName: string;
    billMonth: string;
    totalAmount: number;
    unitsConsumed: number;
    maxDemand?: number;
    powerFactor?: number;
    insights: {
        summary: string;
        insights: string[];
        recommendations: string[];
        potentialSavings: number;
        riskLevel: 'low' | 'medium' | 'high';
    };
}

// Upload bill image to Supabase Storage
export async function uploadBillImage(fileName: string, fileBlob: Blob, userId: string): Promise<string | null> {
    if (isDemoMode()) {
        console.log('Demo mode: Skipping file upload');
        return null;
    }

    const supabase = createClient();

    const fileExt = fileName.split('.').pop();
    const uniqueName = `${userId}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from('bills')
        .upload(uniqueName, fileBlob, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Error uploading file:', error);
        return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
        .from('bills')
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

// Save bill record to database
export async function saveBillToDatabase(input: CreateBillInput): Promise<BillRecord | null> {
    if (isDemoMode()) {
        console.log('Demo mode: Skipping database save');
        return null;
    }

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
        console.error('User not authenticated');
        return null;
    }

    // First upload the image
    const fileUrl = await uploadBillImage(input.fileName, input.fileBlob, userData.user.id);

    // Get user's organization_id from users table
    const { data: userRecord } = await supabase
        .from('users')
        .select('organization_id')
        .eq('id', userData.user.id)
        .single();

    const { data, error } = await supabase
        .from('bills')
        .insert({
            user_id: userData.user.id,
            organization_id: userRecord?.organization_id || null,
            file_name: input.fileName,
            file_url: fileUrl || null,
            bill_month: input.billMonth.length === 7 ? `${input.billMonth}-01` : input.billMonth,
            total_amount: input.totalAmount,
            units_consumed_kwh: input.unitsConsumed,
            max_demand_kva: input.maxDemand || null,
            power_factor: input.powerFactor || null,
            status: 'processed',
            parsed_data: {
                site_name: input.siteName,
                insights_summary: input.insights.summary,
                insights_list: input.insights.insights,
                recommendations: input.insights.recommendations,
                potential_savings: input.insights.potentialSavings,
                risk_level: input.insights.riskLevel,
            },
        })
        .select()
        .single();

    if (error) {
        console.error('Error saving bill:', error.message || error.code || JSON.stringify(error));
        return null;
    }

    return data;
}

// Fetch all bills for current user's organization
export async function fetchUserBills(): Promise<BillRecord[]> {
    if (isDemoMode()) {
        console.log('Demo mode: Returning empty bills');
        return [];
    }

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
        return [];
    }

    const { data, error } = await supabase
        .from('bills')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching bills:', error);
        return [];
    }

    return data || [];
}

// Fetch single bill by ID
export async function fetchBillById(billId: string): Promise<BillRecord | null> {
    if (isDemoMode()) {
        return null;
    }

    const supabase = createClient();

    const { data, error } = await supabase
        .from('bills')
        .select('*')
        .eq('id', billId)
        .single();

    if (error) {
        console.error('Error fetching bill:', error);
        return null;
    }

    return data;
}

// Delete bill
export async function deleteBill(billId: string): Promise<boolean> {
    if (isDemoMode()) {
        return false;
    }

    const supabase = createClient();

    const { error } = await supabase
        .from('bills')
        .delete()
        .eq('id', billId);

    if (error) {
        console.error('Error deleting bill:', error);
        return false;
    }

    return true;
}
