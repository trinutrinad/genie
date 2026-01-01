# Quick Environment Variables Setup

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Click on your project: **gram_seva**
3. Go to **Settings** (gear icon in left sidebar)
4. Click on **API** under Project Settings

## Step 2: Copy These Values

From the API settings page, you'll see:

### Project URL
- Copy the **Project URL** (looks like: `https://xxxxx.supabase.co`)
- This goes in: `NEXT_PUBLIC_SUPABASE_URL`

### API Keys
- Scroll down to **Project API keys**
- Copy the **anon public** key (long string starting with `eyJ...`)
- This goes in: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy the **service_role** key (also starts with `eyJ...`)
- This goes in: `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Create .env.local File

In your project root (`e:\python_projects\gram_seva`), create a file named `.env.local`

Copy this template and replace with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://hboxhmyzorabodipusfl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important Notes:**
- ✅ Replace `...` with your actual keys
- ✅ Keep the `NEXT_PUBLIC_` prefix for client-side variables
- ✅ Don't include quotes around the values
- ✅ Don't add spaces around the `=` sign
- ⚠️ `.env.local` is already in `.gitignore` (safe from Git)

## Step 4: Verify Setup

1. Save the `.env.local` file
2. Restart your dev server:
   ```bash
   npm run dev
   ```
3. Check the terminal for any errors

## Example of Correct Format

✅ **Correct:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://hboxhmyzorabodipusfl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4b3JobXl6b3JhYm9kaXB1c2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5OTk5OTksImV4cCI6MjAxNTU3NTk5OX0.example
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4b3JobXl6b3JhYm9kaXB1c2ZsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5OTk5OTk5OSwiZXhwIjoyMDE1NTc1OTk5fQ.example
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

❌ **Wrong:**
```env
# Don't use quotes
NEXT_PUBLIC_SUPABASE_URL="https://..."
# Don't add spaces
NEXT_PUBLIC_SUPABASE_URL = https://...
# Don't forget NEXT_PUBLIC_ prefix for client variables
SUPABASE_URL=https://...
```

## Troubleshooting

### "Missing Supabase environment variables" error
- Check that `.env.local` file exists in project root
- Verify variable names are exactly as shown (case-sensitive)
- Make sure no quotes around values
- Restart dev server after creating/editing `.env.local`

### Still not working?
1. Double-check you copied the entire key (they're very long)
2. Make sure there are no extra spaces
3. Try copying from Supabase dashboard again
4. Restart your terminal and dev server

