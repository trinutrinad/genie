# Supabase Setup Guide for Gaon Seva

This guide will help you connect your Supabase project to the Gaon Seva application.

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **gram_seva**
3. Go to **Settings** → **API** (in the left sidebar)
4. You'll need these values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys" → "anon public")
   - **service_role** key (under "Project API keys" → "service_role") - Keep this secret!

## Step 2: Set Up Environment Variables

1. In your project root (`e:\python_projects\gram_seva`), create a file named `.env.local`
2. Add the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Replace the placeholder values with your actual Supabase credentials.**

Example:
```env
NEXT_PUBLIC_SUPABASE_URL=https://hboxhmyzorabodipusfl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 3: Create Database Tables

1. In Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Open the file: `lib/database-schema.md`
3. Copy and run the SQL commands section by section:
   - First: Create Tables
   - Second: Create Indexes
   - Third: Create Functions
   - Fourth: Set up Row Level Security (RLS)
   - Fifth: Create Storage Buckets (via Dashboard) and Storage Policies

**Or follow these quick steps:**

### Quick Database Setup:

1. **Go to SQL Editor** in Supabase Dashboard
2. **Create all tables** - Copy the "Step 1: Create Tables" section from `lib/database-schema.md` and run it
3. **Create indexes** - Copy "Step 2: Create Indexes" and run it
4. **Create functions** - Copy "Step 3: Create Functions" and run it
5. **Set up RLS** - Copy "Step 4: Set up Row Level Security" and run it
6. **Create Storage Buckets**:
   - Go to **Storage** in the left sidebar
   - Click "New bucket"
   - Create bucket: `profile-photos` (public: Yes)
   - Create bucket: `work-photos` (public: Yes)
   - Go back to SQL Editor and run "Step 5: Create Storage Buckets" policies

## Step 4: Verify Connection

1. Make sure your `.env.local` file is created with correct values
2. Restart your development server:
   ```bash
   npm run dev
   ```
3. Check the console for any Supabase connection errors

## Step 5: Test the Setup

Once everything is set up, you can test by:

1. Visiting http://localhost:3000
2. The app should load without errors
3. Try navigating to different pages

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure `.env.local` exists in the project root
- Check that variable names are exactly as shown (with `NEXT_PUBLIC_` prefix where needed)
- Restart the dev server after adding environment variables

### Database connection issues
- Verify your Project URL is correct
- Check that your API keys are correct
- Make sure your Supabase project is active (not paused)

### RLS (Row Level Security) errors
- Make sure you've run all the RLS policies from the schema file
- Check that policies are enabled on all tables

## Next Steps

After completing this setup:

1. ✅ Database tables created
2. ✅ RLS policies set up
3. ✅ Storage buckets created
4. ✅ Environment variables configured

You can now proceed with:
- Building registration forms
- Creating API routes
- Testing authentication
- Adding provider profiles

## Quick Reference

- **Supabase Dashboard**: https://supabase.com/dashboard/project/hboxhmyzorabodipusfl
- **SQL Editor**: Dashboard → SQL Editor
- **API Settings**: Dashboard → Settings → API
- **Storage**: Dashboard → Storage

## Security Notes

⚠️ **Important**: Never commit `.env.local` to Git! It's already in `.gitignore`.

⚠️ **Service Role Key**: The `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS. Only use it server-side and never expose it to the client!
