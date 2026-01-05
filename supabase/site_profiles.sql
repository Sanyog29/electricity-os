-- =====================================================
-- Site Profiles - Enhanced Site Data (Section 12)
-- Run this in Supabase SQL Editor to add site profile support
-- =====================================================

-- Site profiles table for detailed site configuration
CREATE TABLE IF NOT EXISTS site_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    
    -- Connection Details
    supply_type TEXT CHECK (supply_type IN ('LT', 'HT', 'EHT')),
    tariff_category TEXT,
    sanctioned_load_kw DECIMAL(10, 2),
    contract_demand_kva DECIMAL(10, 2),
    connected_load_kw DECIMAL(10, 2),
    
    -- DISCOM Information
    discom_id UUID REFERENCES discoms(id),
    consumer_number TEXT,
    meter_number TEXT,
    
    -- Operating Parameters
    operating_hours_per_day INT CHECK (operating_hours_per_day >= 0 AND operating_hours_per_day <= 24),
    operating_days_per_month INT CHECK (operating_days_per_month >= 0 AND operating_days_per_month <= 31),
    peak_usage_hours TEXT,
    shift_pattern TEXT,
    
    -- Consumption Baseline
    avg_monthly_units_kwh DECIMAL(12, 2),
    avg_monthly_cost DECIMAL(12, 2),
    avg_power_factor DECIMAL(5, 3) CHECK (avg_power_factor >= 0 AND avg_power_factor <= 1),
    power_factor_target DECIMAL(5, 3) CHECK (power_factor_target >= 0 AND power_factor_target <= 1),
    max_demand_kva DECIMAL(10, 2),
    
    -- Equipment Details (JSONB for flexibility)
    major_equipment JSONB DEFAULT '[]',
    hvac_details JSONB DEFAULT '{}',
    
    -- Solar/Renewable
    has_solar BOOLEAN DEFAULT FALSE,
    solar_capacity_kw DECIMAL(10, 2),
    net_metering BOOLEAN DEFAULT FALSE,
    
    -- Backup Power
    has_dg BOOLEAN DEFAULT FALSE,
    dg_capacity_kva DECIMAL(10, 2),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one profile per site
    UNIQUE(site_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_site_profiles_site_id ON site_profiles(site_id);

-- RLS for site profiles
ALTER TABLE site_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view profiles for their sites
CREATE POLICY "Users can view their site profiles" ON site_profiles
    FOR SELECT USING (
        site_id IN (SELECT id FROM sites WHERE user_id = auth.uid())
    );

-- Users can insert profiles for their sites
CREATE POLICY "Users can insert their site profiles" ON site_profiles
    FOR INSERT WITH CHECK (
        site_id IN (SELECT id FROM sites WHERE user_id = auth.uid())
    );

-- Users can update profiles for their sites
CREATE POLICY "Users can update their site profiles" ON site_profiles
    FOR UPDATE USING (
        site_id IN (SELECT id FROM sites WHERE user_id = auth.uid())
    );

-- Users can delete profiles for their sites
CREATE POLICY "Users can delete their site profiles" ON site_profiles
    FOR DELETE USING (
        site_id IN (SELECT id FROM sites WHERE user_id = auth.uid())
    );

-- =====================================================
-- Consumption History Table (for trending)
-- =====================================================

CREATE TABLE IF NOT EXISTS consumption_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    
    -- Period
    period_month DATE NOT NULL,
    
    -- Consumption data
    units_kwh DECIMAL(12, 2) NOT NULL,
    cost_inr DECIMAL(12, 2),
    max_demand_kva DECIMAL(10, 2),
    power_factor DECIMAL(5, 3),
    
    -- Source
    source TEXT DEFAULT 'bill' CHECK (source IN ('bill', 'manual', 'meter', 'estimated')),
    bill_id UUID REFERENCES bills(id) ON DELETE SET NULL,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- One entry per site per month
    UNIQUE(site_id, period_month)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_consumption_history_site ON consumption_history(site_id);
CREATE INDEX IF NOT EXISTS idx_consumption_history_period ON consumption_history(period_month);

-- RLS for consumption history
ALTER TABLE consumption_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their consumption history" ON consumption_history
    FOR SELECT USING (
        site_id IN (SELECT id FROM sites WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can insert their consumption history" ON consumption_history
    FOR INSERT WITH CHECK (
        site_id IN (SELECT id FROM sites WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can update their consumption history" ON consumption_history
    FOR UPDATE USING (
        site_id IN (SELECT id FROM sites WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can delete their consumption history" ON consumption_history
    FOR DELETE USING (
        site_id IN (SELECT id FROM sites WHERE user_id = auth.uid())
    );
