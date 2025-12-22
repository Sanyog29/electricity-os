export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            organizations: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    industry: string | null
                    gst_number: string | null
                    address: string | null
                    city: string | null
                    state: string | null
                    pincode: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    industry?: string | null
                    gst_number?: string | null
                    address?: string | null
                    city?: string | null
                    state?: string | null
                    pincode?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    industry?: string | null
                    gst_number?: string | null
                    address?: string | null
                    city?: string | null
                    state?: string | null
                    pincode?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            users: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    phone: string | null
                    role: 'owner' | 'admin' | 'member' | 'viewer'
                    organization_id: string | null
                    avatar_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    phone?: string | null
                    role?: 'owner' | 'admin' | 'member' | 'viewer'
                    organization_id?: string | null
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    phone?: string | null
                    role?: 'owner' | 'admin' | 'member' | 'viewer'
                    organization_id?: string | null
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            discoms: {
                Row: {
                    id: string
                    name: string
                    short_code: string
                    state: string
                    website: string | null
                    support_email: string | null
                    support_phone: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    short_code: string
                    state: string
                    website?: string | null
                    support_email?: string | null
                    support_phone?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    short_code?: string
                    state?: string
                    website?: string | null
                    support_email?: string | null
                    support_phone?: string | null
                    created_at?: string
                }
            }
            sites: {
                Row: {
                    id: string
                    organization_id: string
                    name: string
                    address: string | null
                    city: string | null
                    state: string | null
                    pincode: string | null
                    latitude: number | null
                    longitude: number | null
                    site_type: string | null
                    area_sqft: number | null
                    operational_hours: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    organization_id: string
                    name: string
                    address?: string | null
                    city?: string | null
                    state?: string | null
                    pincode?: string | null
                    latitude?: number | null
                    longitude?: number | null
                    site_type?: string | null
                    area_sqft?: number | null
                    operational_hours?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    organization_id?: string
                    name?: string
                    address?: string | null
                    city?: string | null
                    state?: string | null
                    pincode?: string | null
                    latitude?: number | null
                    longitude?: number | null
                    site_type?: string | null
                    area_sqft?: number | null
                    operational_hours?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            meters: {
                Row: {
                    id: string
                    site_id: string
                    discom_id: string | null
                    consumer_number: string
                    meter_number: string | null
                    account_id: string | null
                    tariff_category: string
                    sanctioned_load_kw: number | null
                    contract_demand_kva: number | null
                    connected_load_kw: number | null
                    supply_voltage: string | null
                    phase: string | null
                    installation_date: string | null
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    site_id: string
                    discom_id?: string | null
                    consumer_number: string
                    meter_number?: string | null
                    account_id?: string | null
                    tariff_category: string
                    sanctioned_load_kw?: number | null
                    contract_demand_kva?: number | null
                    connected_load_kw?: number | null
                    supply_voltage?: string | null
                    phase?: string | null
                    installation_date?: string | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    site_id?: string
                    discom_id?: string | null
                    consumer_number?: string
                    meter_number?: string | null
                    account_id?: string | null
                    tariff_category?: string
                    sanctioned_load_kw?: number | null
                    contract_demand_kva?: number | null
                    connected_load_kw?: number | null
                    supply_voltage?: string | null
                    phase?: string | null
                    installation_date?: string | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            bills: {
                Row: {
                    id: string
                    meter_id: string
                    organization_id: string
                    bill_month: string
                    bill_date: string | null
                    due_date: string | null
                    file_url: string | null
                    file_name: string | null
                    file_type: string | null
                    status: 'uploaded' | 'processing' | 'processed' | 'audited' | 'error'
                    ocr_raw_text: string | null
                    ocr_confidence: number | null
                    total_amount: number | null
                    units_consumed_kwh: number | null
                    max_demand_kva: number | null
                    power_factor: number | null
                    previous_reading: number | null
                    current_reading: number | null
                    parsed_data: Json
                    is_audited: boolean
                    audit_score: number | null
                    has_issues: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    meter_id: string
                    organization_id: string
                    bill_month: string
                    bill_date?: string | null
                    due_date?: string | null
                    file_url?: string | null
                    file_name?: string | null
                    file_type?: string | null
                    status?: 'uploaded' | 'processing' | 'processed' | 'audited' | 'error'
                    ocr_raw_text?: string | null
                    ocr_confidence?: number | null
                    total_amount?: number | null
                    units_consumed_kwh?: number | null
                    max_demand_kva?: number | null
                    power_factor?: number | null
                    previous_reading?: number | null
                    current_reading?: number | null
                    parsed_data?: Json
                    is_audited?: boolean
                    audit_score?: number | null
                    has_issues?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    meter_id?: string
                    organization_id?: string
                    bill_month?: string
                    bill_date?: string | null
                    due_date?: string | null
                    file_url?: string | null
                    file_name?: string | null
                    file_type?: string | null
                    status?: 'uploaded' | 'processing' | 'processed' | 'audited' | 'error'
                    ocr_raw_text?: string | null
                    ocr_confidence?: number | null
                    total_amount?: number | null
                    units_consumed_kwh?: number | null
                    max_demand_kva?: number | null
                    power_factor?: number | null
                    previous_reading?: number | null
                    current_reading?: number | null
                    parsed_data?: Json
                    is_audited?: boolean
                    audit_score?: number | null
                    has_issues?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            bill_line_items: {
                Row: {
                    id: string
                    bill_id: string
                    item_type: string
                    description: string
                    original_text: string | null
                    quantity: number | null
                    rate: number | null
                    amount: number
                    is_validated: boolean
                    expected_amount: number | null
                    variance: number | null
                    variance_percent: number | null
                    has_issue: boolean
                    issue_type: string | null
                    issue_description: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    bill_id: string
                    item_type: string
                    description: string
                    original_text?: string | null
                    quantity?: number | null
                    rate?: number | null
                    amount: number
                    is_validated?: boolean
                    expected_amount?: number | null
                    variance?: number | null
                    variance_percent?: number | null
                    has_issue?: boolean
                    issue_type?: string | null
                    issue_description?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    bill_id?: string
                    item_type?: string
                    description?: string
                    original_text?: string | null
                    quantity?: number | null
                    rate?: number | null
                    amount?: number
                    is_validated?: boolean
                    expected_amount?: number | null
                    variance?: number | null
                    variance_percent?: number | null
                    has_issue?: boolean
                    issue_type?: string | null
                    issue_description?: string | null
                    created_at?: string
                }
            }
            audits: {
                Row: {
                    id: string
                    bill_id: string
                    audit_type: 'automatic' | 'manual'
                    status: 'pending' | 'in_progress' | 'completed'
                    total_issues: number
                    total_savings_identified: number
                    findings: Json
                    audited_by: string | null
                    audited_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    bill_id: string
                    audit_type?: 'automatic' | 'manual'
                    status?: 'pending' | 'in_progress' | 'completed'
                    total_issues?: number
                    total_savings_identified?: number
                    findings?: Json
                    audited_by?: string | null
                    audited_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    bill_id?: string
                    audit_type?: 'automatic' | 'manual'
                    status?: 'pending' | 'in_progress' | 'completed'
                    total_issues?: number
                    total_savings_identified?: number
                    findings?: Json
                    audited_by?: string | null
                    audited_at?: string | null
                    created_at?: string
                }
            }
            savings_opportunities: {
                Row: {
                    id: string
                    organization_id: string
                    bill_id: string | null
                    meter_id: string | null
                    opportunity_type: string
                    title: string
                    description: string | null
                    estimated_monthly_savings: number | null
                    estimated_annual_savings: number | null
                    implementation_cost: number | null
                    payback_months: number | null
                    priority: 'low' | 'medium' | 'high' | 'critical'
                    status: 'identified' | 'under_review' | 'approved' | 'implementing' | 'completed' | 'rejected'
                    action_steps: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    organization_id: string
                    bill_id?: string | null
                    meter_id?: string | null
                    opportunity_type: string
                    title: string
                    description?: string | null
                    estimated_monthly_savings?: number | null
                    estimated_annual_savings?: number | null
                    implementation_cost?: number | null
                    payback_months?: number | null
                    priority?: 'low' | 'medium' | 'high' | 'critical'
                    status?: 'identified' | 'under_review' | 'approved' | 'implementing' | 'completed' | 'rejected'
                    action_steps?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    organization_id?: string
                    bill_id?: string | null
                    meter_id?: string | null
                    opportunity_type?: string
                    title?: string
                    description?: string | null
                    estimated_monthly_savings?: number | null
                    estimated_annual_savings?: number | null
                    implementation_cost?: number | null
                    payback_months?: number | null
                    priority?: 'low' | 'medium' | 'high' | 'critical'
                    status?: 'identified' | 'under_review' | 'approved' | 'implementing' | 'completed' | 'rejected'
                    action_steps?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            workflows: {
                Row: {
                    id: string
                    organization_id: string
                    workflow_type: string
                    title: string
                    description: string | null
                    related_bill_id: string | null
                    related_saving_id: string | null
                    status: 'draft' | 'active' | 'on_hold' | 'completed' | 'cancelled'
                    priority: string
                    due_date: string | null
                    completed_at: string | null
                    template_used: string | null
                    generated_documents: Json
                    created_by: string | null
                    assigned_to: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    organization_id: string
                    workflow_type: string
                    title: string
                    description?: string | null
                    related_bill_id?: string | null
                    related_saving_id?: string | null
                    status?: 'draft' | 'active' | 'on_hold' | 'completed' | 'cancelled'
                    priority?: string
                    due_date?: string | null
                    completed_at?: string | null
                    template_used?: string | null
                    generated_documents?: Json
                    created_by?: string | null
                    assigned_to?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    organization_id?: string
                    workflow_type?: string
                    title?: string
                    description?: string | null
                    related_bill_id?: string | null
                    related_saving_id?: string | null
                    status?: 'draft' | 'active' | 'on_hold' | 'completed' | 'cancelled'
                    priority?: string
                    due_date?: string | null
                    completed_at?: string | null
                    template_used?: string | null
                    generated_documents?: Json
                    created_by?: string | null
                    assigned_to?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            tasks: {
                Row: {
                    id: string
                    workflow_id: string | null
                    organization_id: string
                    title: string
                    description: string | null
                    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
                    priority: string
                    due_date: string | null
                    reminder_date: string | null
                    completed_at: string | null
                    assigned_to: string | null
                    created_by: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    workflow_id?: string | null
                    organization_id: string
                    title: string
                    description?: string | null
                    status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
                    priority?: string
                    due_date?: string | null
                    reminder_date?: string | null
                    completed_at?: string | null
                    assigned_to?: string | null
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    workflow_id?: string | null
                    organization_id?: string
                    title?: string
                    description?: string | null
                    status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
                    priority?: string
                    due_date?: string | null
                    reminder_date?: string | null
                    completed_at?: string | null
                    assigned_to?: string | null
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            alerts: {
                Row: {
                    id: string
                    organization_id: string
                    user_id: string
                    alert_type: string
                    title: string
                    message: string | null
                    related_bill_id: string | null
                    related_meter_id: string | null
                    is_read: boolean
                    read_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    organization_id: string
                    user_id: string
                    alert_type: string
                    title: string
                    message?: string | null
                    related_bill_id?: string | null
                    related_meter_id?: string | null
                    is_read?: boolean
                    read_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    organization_id?: string
                    user_id?: string
                    alert_type?: string
                    title?: string
                    message?: string | null
                    related_bill_id?: string | null
                    related_meter_id?: string | null
                    is_read?: boolean
                    read_at?: string | null
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
