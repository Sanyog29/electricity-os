-- =====================================================
-- Electricity Bill OS - Database Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ORGANIZATIONS & USERS
-- =====================================================

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  industry TEXT,
  gst_number TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DISCOMS & TARIFFS
-- =====================================================

CREATE TABLE discoms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  short_code TEXT UNIQUE NOT NULL,
  state TEXT NOT NULL,
  website TEXT,
  support_email TEXT,
  support_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tariff_structures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discom_id UUID REFERENCES discoms(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- LT, HT, EHT, Domestic, Commercial, Industrial
  sub_category TEXT,
  effective_from DATE NOT NULL,
  effective_to DATE,
  
  -- Rate structure (JSONB for flexibility)
  energy_charges JSONB NOT NULL DEFAULT '{}',
  fixed_charges JSONB DEFAULT '{}',
  demand_charges JSONB DEFAULT '{}',
  
  -- Surcharges and taxes
  fuel_adjustment_charge DECIMAL(10, 4),
  electricity_duty_percent DECIMAL(5, 2),
  wheeling_charges DECIMAL(10, 4),
  cross_subsidy_surcharge DECIMAL(10, 4),
  
  -- Rebates
  prompt_payment_rebate_percent DECIMAL(5, 2),
  pf_incentive JSONB DEFAULT '{}',
  
  -- TOD (Time of Day) rates
  tod_applicable BOOLEAN DEFAULT FALSE,
  tod_rates JSONB DEFAULT '{}',
  
  -- Metadata
  source_document TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SITES & METERS
-- =====================================================

CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  site_type TEXT, -- office, factory, warehouse, retail, hospital, hotel, etc.
  area_sqft DECIMAL(12, 2),
  operational_hours TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE meters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  discom_id UUID REFERENCES discoms(id),
  
  -- Connection details
  consumer_number TEXT NOT NULL,
  meter_number TEXT,
  account_id TEXT,
  
  -- Category and load
  tariff_category TEXT NOT NULL,
  sanctioned_load_kw DECIMAL(10, 2),
  contract_demand_kva DECIMAL(10, 2),
  connected_load_kw DECIMAL(10, 2),
  
  -- Metadata
  supply_voltage TEXT, -- LT, HT, EHT
  phase TEXT, -- single, three
  installation_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- BILLS
-- =====================================================

CREATE TABLE bills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meter_id UUID REFERENCES meters(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Bill period
  bill_month DATE NOT NULL,
  bill_date DATE,
  due_date DATE,
  
  -- File info
  file_url TEXT,
  file_name TEXT,
  file_type TEXT, -- pdf, image
  
  -- Processing status
  status TEXT DEFAULT 'uploaded' CHECK (status IN (
    'uploaded', 'processing', 'processed', 'audited', 'error'
  )),
  ocr_raw_text TEXT,
  ocr_confidence DECIMAL(5, 2),
  
  -- Extracted data
  total_amount DECIMAL(12, 2),
  units_consumed_kwh DECIMAL(12, 2),
  max_demand_kva DECIMAL(10, 2),
  power_factor DECIMAL(5, 3),
  
  previous_reading DECIMAL(12, 2),
  current_reading DECIMAL(12, 2),
  
  -- Parsed components (JSONB for flexibility)
  parsed_data JSONB DEFAULT '{}',
  
  -- Audit results
  is_audited BOOLEAN DEFAULT FALSE,
  audit_score DECIMAL(5, 2), -- 0-100
  has_issues BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bill_line_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
  
  item_type TEXT NOT NULL, -- energy_charge, fixed_charge, demand_charge, tax, surcharge, rebate, penalty
  description TEXT NOT NULL,
  original_text TEXT, -- Raw text from OCR
  
  quantity DECIMAL(12, 4),
  rate DECIMAL(12, 6),
  amount DECIMAL(12, 2) NOT NULL,
  
  -- Validation
  is_validated BOOLEAN DEFAULT FALSE,
  expected_amount DECIMAL(12, 2),
  variance DECIMAL(12, 2),
  variance_percent DECIMAL(8, 2),
  has_issue BOOLEAN DEFAULT FALSE,
  issue_type TEXT,
  issue_description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- AUDITS & FINDINGS
-- =====================================================

CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
  
  audit_type TEXT DEFAULT 'automatic' CHECK (audit_type IN ('automatic', 'manual')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  
  -- Summary
  total_issues INTEGER DEFAULT 0,
  total_savings_identified DECIMAL(12, 2) DEFAULT 0,
  
  -- Results stored as JSONB
  findings JSONB DEFAULT '[]',
  
  audited_by UUID REFERENCES users(id),
  audited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE savings_opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  bill_id UUID REFERENCES bills(id) ON DELETE SET NULL,
  meter_id UUID REFERENCES meters(id) ON DELETE SET NULL,
  
  opportunity_type TEXT NOT NULL, -- tariff_optimization, category_change, pf_improvement, demand_reduction, solar, open_access
  title TEXT NOT NULL,
  description TEXT,
  
  estimated_monthly_savings DECIMAL(12, 2),
  estimated_annual_savings DECIMAL(12, 2),
  implementation_cost DECIMAL(12, 2),
  payback_months INTEGER,
  
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'identified' CHECK (status IN ('identified', 'under_review', 'approved', 'implementing', 'completed', 'rejected')),
  
  action_steps JSONB DEFAULT '[]',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- WORKFLOWS & TASKS
-- =====================================================

CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  workflow_type TEXT NOT NULL, -- dispute, approval, vendor_action, optimization
  title TEXT NOT NULL,
  description TEXT,
  
  related_bill_id UUID REFERENCES bills(id) ON DELETE SET NULL,
  related_saving_id UUID REFERENCES savings_opportunities(id) ON DELETE SET NULL,
  
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'on_hold', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium',
  
  due_date DATE,
  completed_at TIMESTAMPTZ,
  
  -- Templates and documents
  template_used TEXT,
  generated_documents JSONB DEFAULT '[]',
  
  created_by UUID REFERENCES users(id),
  assigned_to UUID REFERENCES users(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium',
  
  due_date DATE,
  reminder_date DATE,
  completed_at TIMESTAMPTZ,
  
  assigned_to UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ALERTS & NOTIFICATIONS
-- =====================================================

CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  alert_type TEXT NOT NULL, -- anomaly, due_date, penalty, savings_opportunity, system
  title TEXT NOT NULL,
  message TEXT,
  
  related_bill_id UUID REFERENCES bills(id) ON DELETE SET NULL,
  related_meter_id UUID REFERENCES meters(id) ON DELETE SET NULL,
  
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_sites_organization ON sites(organization_id);
CREATE INDEX idx_meters_site ON meters(site_id);
CREATE INDEX idx_meters_discom ON meters(discom_id);
CREATE INDEX idx_bills_meter ON bills(meter_id);
CREATE INDEX idx_bills_organization ON bills(organization_id);
CREATE INDEX idx_bills_bill_month ON bills(bill_month);
CREATE INDEX idx_bills_status ON bills(status);
CREATE INDEX idx_bill_line_items_bill ON bill_line_items(bill_id);
CREATE INDEX idx_audits_bill ON audits(bill_id);
CREATE INDEX idx_savings_organization ON savings_opportunities(organization_id);
CREATE INDEX idx_workflows_organization ON workflows(organization_id);
CREATE INDEX idx_tasks_workflow ON tasks(workflow_id);
CREATE INDEX idx_alerts_user ON alerts(user_id);
CREATE INDEX idx_alerts_unread ON alerts(user_id, is_read) WHERE NOT is_read;

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE meters ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Organization members can view organization data
CREATE POLICY "Org members can view org" ON organizations
  FOR SELECT USING (
    id IN (SELECT organization_id FROM users WHERE id = auth.uid())
  );

-- Organization members can view org sites
CREATE POLICY "Org members can view sites" ON sites
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Org members can manage sites" ON sites
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid() AND role IN ('owner', 'admin'))
  );

-- Organization members can view org meters
CREATE POLICY "Org members can view meters" ON meters
  FOR SELECT USING (
    site_id IN (
      SELECT s.id FROM sites s 
      JOIN users u ON u.organization_id = s.organization_id 
      WHERE u.id = auth.uid()
    )
  );

-- Organization members can view org bills
CREATE POLICY "Org members can view bills" ON bills
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Org members can create bills" ON bills
  FOR INSERT WITH CHECK (
    organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid())
  );

-- Users can view their own alerts
CREATE POLICY "Users can view own alerts" ON alerts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own alerts" ON alerts
  FOR UPDATE USING (user_id = auth.uid());

-- =====================================================
-- SEED DATA: Sample DISCOMs
-- =====================================================

INSERT INTO discoms (name, short_code, state, website) VALUES
  ('BSES Rajdhani Power Limited', 'BRPL', 'Delhi', 'https://bsesdelhi.com'),
  ('BSES Yamuna Power Limited', 'BYPL', 'Delhi', 'https://bsesdelhi.com'),
  ('Tata Power Delhi Distribution', 'TPDDL', 'Delhi', 'https://www.tatapower-ddl.com'),
  ('Maharashtra State Electricity Distribution Company', 'MSEDCL', 'Maharashtra', 'https://www.mahadiscom.in'),
  ('Adani Electricity Mumbai', 'AEML', 'Maharashtra', 'https://www.adanielectricity.com'),
  ('BESCOM', 'BESCOM', 'Karnataka', 'https://bescom.karnataka.gov.in'),
  ('TANGEDCO', 'TANGEDCO', 'Tamil Nadu', 'https://www.tangedco.gov.in'),
  ('CESC Limited', 'CESC', 'West Bengal', 'https://www.cesc.co.in'),
  ('Uttar Pradesh Power Corporation', 'UPPCL', 'Uttar Pradesh', 'https://www.uppcl.org'),
  ('Gujarat Urja Vikas Nigam', 'GUVNL', 'Gujarat', 'https://www.gseb.com');
