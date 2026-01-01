# Database Setup Instructions

## Quick Setup (Recommended)

1. **Open Supabase SQL Editor**
   - Go to your Supabase Dashboard
   - Click **SQL Editor** in the left sidebar
   - Click **New Query**

2. **Run the Complete Setup Script**
   - Open the file: `scripts/setup-database.sql`
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click **Run** (or press Ctrl+Enter)

3. **Create Storage Buckets**
   - Go to **Storage** in the left sidebar
   - Click **New bucket**
   - Create bucket: `profile-photos`
     - Public bucket: ✅ Yes
   - Create bucket: `work-photos`
     - Public bucket: ✅ Yes

4. **Set Storage Policies**
   - Go back to **SQL Editor**
   - Run this SQL:

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

## Verify Setup

After running the script, verify everything is set up:

1. **Check Tables**
   - Go to **Table Editor** in Supabase Dashboard
   - You should see 5 tables:
     - profiles
     - service_providers
     - contacts
     - reviews
     - saved_providers

2. **Check Storage**
   - Go to **Storage** in Supabase Dashboard
   - You should see 2 buckets:
     - profile-photos
     - work-photos

3. **Test Connection**
   - Your app should now be able to connect to Supabase
   - Run: `npm run dev`
   - Check for any errors in the console

## What Was Created

✅ **5 Database Tables:**
- `profiles` - User profiles (customers & providers)
- `service_providers` - Service provider details
- `contacts` - Contact/lead tracking
- `reviews` - Reviews and ratings
- `saved_providers` - Bookmarked providers

✅ **Indexes** - For fast queries
✅ **Functions** - Auto-update ratings, timestamps
✅ **Triggers** - Automatic updates
✅ **RLS Policies** - Security rules
✅ **Storage Buckets** - For images

## Troubleshooting

### "relation does not exist" error
- Make sure you ran the complete SQL script
- Check that all tables were created in Table Editor

### RLS errors
- Verify RLS is enabled on all tables
- Check that policies were created (Settings → API → Policies)

### Storage errors
- Make sure buckets are created and set to public
- Verify storage policies are set

## Next Steps

After database setup is complete:
1. ✅ Test the connection
2. ✅ Build registration forms
3. ✅ Create API routes
4. ✅ Test authentication

Your database is now ready! 🎉

