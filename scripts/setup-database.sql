-- Complete Database Setup Script for Genie
-- Copy and paste this entire script into Supabase SQL Editor
-- Or run section by section if you prefer

-- ============================================
-- STEP 1: Enable Extensions
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STEP 2: Create Tables
-- ============================================

-- Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  whatsapp_number TEXT,
  village TEXT,
  block TEXT,
  district TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'provider')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service Providers Table
CREATE TABLE IF NOT EXISTS service_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_category TEXT NOT NULL,
  specific_services TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  price_min INTEGER,
  price_max INTEGER,
  service_area TEXT[] DEFAULT '{}',
  about TEXT,
  profile_photo_url TEXT,
  work_photos TEXT[] DEFAULT '{}',
  aadhaar_number TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  rating_avg DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts/Leads Table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  message TEXT,
  contact_method TEXT NOT NULL CHECK (contact_method IN ('call', 'whatsapp')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(provider_id, customer_id, lead_id)
);

-- Saved Providers Table
CREATE TABLE IF NOT EXISTS saved_providers (
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (customer_id, provider_id)
);

-- ============================================
-- STEP 3: Create Functions
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update provider rating
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE service_providers
    SET 
        rating_avg = (
            SELECT COALESCE(AVG(rating)::DECIMAL(3,2), 0)
            FROM reviews
            WHERE provider_id = COALESCE(NEW.provider_id, OLD.provider_id)
        ),
        rating_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE provider_id = COALESCE(NEW.provider_id, OLD.provider_id)
        )
    WHERE id = COALESCE(NEW.provider_id, OLD.provider_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(provider_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE service_providers
    SET view_count = view_count + 1
    WHERE id = provider_uuid;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STEP 4: Create Triggers
-- ============================================

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_service_providers_updated_at ON service_providers;
CREATE TRIGGER update_service_providers_updated_at
    BEFORE UPDATE ON service_providers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for rating updates
DROP TRIGGER IF EXISTS trigger_update_provider_rating ON reviews;
CREATE TRIGGER trigger_update_provider_rating
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_provider_rating();

-- ============================================
-- STEP 5: Create Indexes
-- ============================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_village ON profiles(village);

-- Service providers indexes
CREATE INDEX IF NOT EXISTS idx_service_providers_user_id ON service_providers(user_id);
CREATE INDEX IF NOT EXISTS idx_service_providers_category ON service_providers(service_category);
CREATE INDEX IF NOT EXISTS idx_service_providers_available ON service_providers(is_available);
CREATE INDEX IF NOT EXISTS idx_service_providers_verified ON service_providers(is_verified);
CREATE INDEX IF NOT EXISTS idx_service_providers_rating ON service_providers(rating_avg DESC);
CREATE INDEX IF NOT EXISTS idx_service_providers_service_area ON service_providers USING GIN(service_area);

-- Contacts indexes
CREATE INDEX IF NOT EXISTS idx_contacts_customer_id ON contacts(customer_id);
CREATE INDEX IF NOT EXISTS idx_contacts_provider_id ON contacts(provider_id);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_provider_id ON reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Saved providers indexes
CREATE INDEX IF NOT EXISTS idx_saved_providers_customer_id ON saved_providers(customer_id);
CREATE INDEX IF NOT EXISTS idx_saved_providers_provider_id ON saved_providers(provider_id);

-- ============================================
-- STEP 6: Enable Row Level Security (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_providers ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 7: Create RLS Policies
-- ============================================

-- Profiles Policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Service Providers Policies
DROP POLICY IF EXISTS "Service providers are viewable by everyone" ON service_providers;
CREATE POLICY "Service providers are viewable by everyone"
    ON service_providers FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Service providers can update own profile" ON service_providers;
CREATE POLICY "Service providers can update own profile"
    ON service_providers FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can create service provider profile" ON service_providers;
CREATE POLICY "Authenticated users can create service provider profile"
    ON service_providers FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Contacts Policies
DROP POLICY IF EXISTS "Users can view own contacts" ON contacts;
CREATE POLICY "Users can view own contacts"
    ON contacts FOR SELECT
    USING (
        auth.uid() = customer_id 
        OR auth.uid() IN (SELECT user_id FROM service_providers WHERE id = provider_id)
    );

DROP POLICY IF EXISTS "Customers can create contacts" ON contacts;
CREATE POLICY "Customers can create contacts"
    ON contacts FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Providers can update contact status" ON contacts;
CREATE POLICY "Providers can update contact status"
    ON contacts FOR UPDATE
    USING (auth.uid() IN (SELECT user_id FROM service_providers WHERE id = provider_id));

-- Reviews Policies
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
CREATE POLICY "Reviews are viewable by everyone"
    ON reviews FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Customers can create reviews" ON reviews;
CREATE POLICY "Customers can create reviews"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Customers can update own reviews" ON reviews;
CREATE POLICY "Customers can update own reviews"
    ON reviews FOR UPDATE
    USING (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Customers can delete own reviews" ON reviews;
CREATE POLICY "Customers can delete own reviews"
    ON reviews FOR DELETE
    USING (auth.uid() = customer_id);

-- Saved Providers Policies
DROP POLICY IF EXISTS "Users can view own saved providers" ON saved_providers;
CREATE POLICY "Users can view own saved providers"
    ON saved_providers FOR SELECT
    USING (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Users can save providers" ON saved_providers;
CREATE POLICY "Users can save providers"
    ON saved_providers FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Users can delete own saved providers" ON saved_providers;
CREATE POLICY "Users can delete own saved providers"
    ON saved_providers FOR DELETE
    USING (auth.uid() = customer_id);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ Database setup complete!';
    RAISE NOTICE '📝 Next: Create storage buckets in Dashboard → Storage';
END $$;

