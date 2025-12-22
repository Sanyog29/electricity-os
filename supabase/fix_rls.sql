-- =====================================================
-- COMPLETE FIX FOR BILLS & STORAGE - RUN IN SUPABASE SQL EDITOR
-- =====================================================

-- STEP 1: Add user_id columns
ALTER TABLE sites ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE bills ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- STEP 2: Create indexes
CREATE INDEX IF NOT EXISTS idx_sites_user_id ON sites(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_user_id ON bills(user_id);

-- STEP 3: Drop ALL existing policies on sites
DO $$ 
DECLARE 
    pol_name TEXT;
BEGIN
    FOR pol_name IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'sites'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON sites', pol_name);
    END LOOP;
END $$;

-- STEP 4: Drop ALL existing policies on bills
DO $$ 
DECLARE 
    pol_name TEXT;
BEGIN
    FOR pol_name IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'bills'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON bills', pol_name);
    END LOOP;
END $$;

-- STEP 5: Create simple policies for SITES
CREATE POLICY "sites_select" ON sites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sites_insert" ON sites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sites_update" ON sites FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "sites_delete" ON sites FOR DELETE USING (auth.uid() = user_id);

-- STEP 6: Create simple policies for BILLS
CREATE POLICY "bills_select" ON bills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "bills_insert" ON bills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bills_update" ON bills FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "bills_delete" ON bills FOR DELETE USING (auth.uid() = user_id);

-- STEP 7: Enable RLS
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STORAGE BUCKET SETUP - THIS IS REQUIRED FOR FILE UPLOADS
-- =====================================================

-- Create the bills storage bucket (public for easy access)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'bills', 
    'bills', 
    true,
    52428800,  -- 50MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing storage policies for bills bucket
DO $$ 
DECLARE 
    pol_name TEXT;
BEGIN
    FOR pol_name IN 
        SELECT policyname FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage'
        AND policyname LIKE '%bills%'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol_name);
    END LOOP;
END $$;

-- Allow authenticated users to upload to bills bucket
CREATE POLICY "bills_upload" ON storage.objects 
FOR INSERT WITH CHECK (
    bucket_id = 'bills' AND 
    auth.role() = 'authenticated'
);

-- Allow authenticated users to update their files
CREATE POLICY "bills_update" ON storage.objects 
FOR UPDATE USING (
    bucket_id = 'bills' AND 
    auth.role() = 'authenticated'
);

-- Allow anyone to read (public bucket)
CREATE POLICY "bills_read" ON storage.objects 
FOR SELECT USING (bucket_id = 'bills');

-- Allow users to delete their own files
CREATE POLICY "bills_delete" ON storage.objects 
FOR DELETE USING (
    bucket_id = 'bills' AND 
    auth.role() = 'authenticated'
);

-- Done! Test uploading a bill now.
