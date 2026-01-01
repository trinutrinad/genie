# Database Schema for Gaon Seva

This document contains the SQL commands to set up your Supabase database.

## Step 1: Create Tables

Run these SQL commands in the Supabase SQL Editor (Dashboard > SQL Editor).

### 1. Enable UUID extension (if not already enabled)
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 2. Create Profiles Table
```sql
CREATE TABLE profiles (
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

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for profiles
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 3. Create Service Providers Table
```sql
CREATE TABLE service_providers (
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

-- Add trigger for service_providers
CREATE TRIGGER update_service_providers_updated_at
    BEFORE UPDATE ON service_providers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 4. Create Contacts/Leads Table
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  message TEXT,
  contact_method TEXT NOT NULL CHECK (contact_method IN ('call', 'whatsapp')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Create Reviews Table
```sql
CREATE TABLE reviews (
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

-- Add trigger for reviews
CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 6. Create Saved Providers Table
```sql
CREATE TABLE saved_providers (
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (customer_id, provider_id)
);
```

## Step 2: Create Indexes for Performance

```sql
-- Profiles indexes
CREATE INDEX idx_profiles_phone ON profiles(phone);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_village ON profiles(village);

-- Service providers indexes
CREATE INDEX idx_service_providers_user_id ON service_providers(user_id);
CREATE INDEX idx_service_providers_category ON service_providers(service_category);
CREATE INDEX idx_service_providers_available ON service_providers(is_available);
CREATE INDEX idx_service_providers_verified ON service_providers(is_verified);
CREATE INDEX idx_service_providers_rating ON service_providers(rating_avg DESC);
CREATE INDEX idx_service_providers_service_area ON service_providers USING GIN(service_area);

-- Contacts indexes
CREATE INDEX idx_contacts_customer_id ON contacts(customer_id);
CREATE INDEX idx_contacts_provider_id ON contacts(provider_id);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);

-- Reviews indexes
CREATE INDEX idx_reviews_provider_id ON reviews(provider_id);
CREATE INDEX idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Saved providers indexes
CREATE INDEX idx_saved_providers_customer_id ON saved_providers(customer_id);
CREATE INDEX idx_saved_providers_provider_id ON saved_providers(provider_id);
```

## Step 3: Create Functions

### Function to update provider rating after review
```sql
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE service_providers
    SET 
        rating_avg = (
            SELECT COALESCE(AVG(rating)::DECIMAL(3,2), 0)
            FROM reviews
            WHERE provider_id = NEW.provider_id
        ),
        rating_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE provider_id = NEW.provider_id
        )
    WHERE id = NEW.provider_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger
CREATE TRIGGER trigger_update_provider_rating
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_provider_rating();
```

### Function to increment view count
```sql
CREATE OR REPLACE FUNCTION increment_view_count(provider_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE service_providers
    SET view_count = view_count + 1
    WHERE id = provider_uuid;
END;
$$ LANGUAGE plpgsql;
```

## Step 4: Set up Row Level Security (RLS)

### Enable RLS on all tables
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_providers ENABLE ROW LEVEL SECURITY;
```

### Profiles Policies
```sql
-- Anyone can read profiles
CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);
```

### Service Providers Policies
```sql
-- Anyone can read service providers
CREATE POLICY "Service providers are viewable by everyone"
    ON service_providers FOR SELECT
    USING (true);

-- Only the owner can update their service provider profile
CREATE POLICY "Service providers can update own profile"
    ON service_providers FOR UPDATE
    USING (auth.uid() = user_id);

-- Only authenticated users can insert service providers
CREATE POLICY "Authenticated users can create service provider profile"
    ON service_providers FOR INSERT
    WITH CHECK (auth.uid() = user_id);
```

### Contacts Policies
```sql
-- Users can read their own contacts (as customer or provider)
CREATE POLICY "Users can view own contacts"
    ON contacts FOR SELECT
    USING (
        auth.uid() = customer_id 
        OR auth.uid() IN (SELECT user_id FROM service_providers WHERE id = provider_id)
    );

-- Customers can create contacts
CREATE POLICY "Customers can create contacts"
    ON contacts FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

-- Providers can update contact status
CREATE POLICY "Providers can update contact status"
    ON contacts FOR UPDATE
    USING (auth.uid() IN (SELECT user_id FROM service_providers WHERE id = provider_id));
```

### Reviews Policies
```sql
-- Anyone can read reviews
CREATE POLICY "Reviews are viewable by everyone"
    ON reviews FOR SELECT
    USING (true);

-- Customers can create reviews
CREATE POLICY "Customers can create reviews"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

-- Customers can update their own reviews
CREATE POLICY "Customers can update own reviews"
    ON reviews FOR UPDATE
    USING (auth.uid() = customer_id);

-- Customers can delete their own reviews
CREATE POLICY "Customers can delete own reviews"
    ON reviews FOR DELETE
    USING (auth.uid() = customer_id);
```

### Saved Providers Policies
```sql
-- Users can read their own saved providers
CREATE POLICY "Users can view own saved providers"
    ON saved_providers FOR SELECT
    USING (auth.uid() = customer_id);

-- Users can save providers
CREATE POLICY "Users can save providers"
    ON saved_providers FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

-- Users can delete their own saved providers
CREATE POLICY "Users can delete own saved providers"
    ON saved_providers FOR DELETE
    USING (auth.uid() = customer_id);
```

## Step 5: Create Storage Buckets

Go to Storage in Supabase Dashboard and create these buckets:

1. **profile-photos**
   - Public bucket: Yes
   - File size limit: 5MB
   - Allowed MIME types: image/jpeg, image/png, image/webp

2. **work-photos**
   - Public bucket: Yes
   - File size limit: 5MB
   - Allowed MIME types: image/jpeg, image/png, image/webp

### Storage Policies (Run in SQL Editor after creating buckets)

```sql
-- Profile photos policies
CREATE POLICY "Profile photos are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can upload own profile photo"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own profile photo"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own profile photo"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Work photos policies
CREATE POLICY "Work photos are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'work-photos');

CREATE POLICY "Providers can upload work photos"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'work-photos');

CREATE POLICY "Providers can update work photos"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'work-photos');

CREATE POLICY "Providers can delete work photos"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'work-photos');
```

## Quick Setup Script

You can copy all the SQL commands above and run them in sequence in the Supabase SQL Editor, or run this complete script (recommended to run section by section):

**Note**: Make sure to run these in order:
1. Tables
2. Indexes
3. Functions
4. RLS Policies
5. Storage buckets (via Dashboard) and Storage policies

After running these, your database will be ready to use!
