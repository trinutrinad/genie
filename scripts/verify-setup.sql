-- Verification Script - Run this to check your database setup
-- This will show you what tables, indexes, and policies exist

-- Check all tables
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    AND table_name IN ('profiles', 'service_providers', 'contacts', 'reviews', 'saved_providers')
ORDER BY table_name;

-- Check indexes
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
    AND tablename IN ('profiles', 'service_providers', 'contacts', 'reviews', 'saved_providers')
ORDER BY tablename, indexname;

-- Check RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN ('profiles', 'service_providers', 'contacts', 'reviews', 'saved_providers')
ORDER BY tablename;

-- Check policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as command
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename IN ('profiles', 'service_providers', 'contacts', 'reviews', 'saved_providers')
ORDER BY tablename, policyname;

-- Check functions
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
    AND routine_name IN ('update_updated_at_column', 'update_provider_rating', 'increment_view_count')
ORDER BY routine_name;

-- Check triggers
SELECT 
    trigger_name,
    event_object_table as table_name,
    action_timing,
    event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
    AND event_object_table IN ('profiles', 'service_providers', 'contacts', 'reviews', 'saved_providers')
ORDER BY event_object_table, trigger_name;

