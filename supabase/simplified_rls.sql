-- =====================================================
-- SIMPLIFIED RLS POLICIES FOR SITES TABLE
-- Run this in Supabase SQL Editor to allow authenticated users 
-- to manage their own sites without organization requirement
-- =====================================================

-- First, drop existing policies on sites
DROP POLICY IF EXISTS "Org members can view sites" ON sites;
DROP POLICY IF EXISTS "Org members can manage sites" ON sites;

-- Create simpler policies that work with direct user_id
-- First, add a user_id column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sites' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE sites ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create index on user_id
CREATE INDEX IF NOT EXISTS idx_sites_user_id ON sites(user_id);

-- Allow users to view their own sites
CREATE POLICY "Users can view their own sites" ON sites
    FOR SELECT USING (auth.uid() = user_id OR organization_id IN (
        SELECT organization_id FROM users WHERE id = auth.uid()
    ));

-- Allow users to insert their own sites
CREATE POLICY "Users can insert their own sites" ON sites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own sites
CREATE POLICY "Users can update their own sites" ON sites
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own sites
CREATE POLICY "Users can delete their own sites" ON sites
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- SIMPLIFIED RLS POLICIES FOR BILLS TABLE
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Org members can view bills" ON bills;
DROP POLICY IF EXISTS "Org members can create bills" ON bills;

-- Add user_id column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bills' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE bills ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create index
CREATE INDEX IF NOT EXISTS idx_bills_user_id ON bills(user_id);

-- Create simpler policies
CREATE POLICY "Users can view their own bills" ON bills
    FOR SELECT USING (auth.uid() = user_id OR organization_id IN (
        SELECT organization_id FROM users WHERE id = auth.uid()
    ));

CREATE POLICY "Users can insert their own bills" ON bills
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bills" ON bills
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bills" ON bills
    FOR DELETE USING (auth.uid() = user_id);
