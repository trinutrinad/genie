# Deployment Guide for Gaon Seva

## Current Setup
- **Backend**: Supabase (already deployed ✅)
- **Frontend**: Next.js (needs deployment)

## Option 1: Vercel (Recommended - Free & Best for Next.js)

### Why Vercel?
- Made by Next.js creators
- Free tier with generous limits
- Automatic deployments from Git
- Built-in CI/CD
- Perfect Next.js optimization

### Steps to Deploy on Vercel:

1. **Prepare Your Code**
   - Make sure all changes are committed to Git
   - Push to GitHub/GitLab/Bitbucket

2. **Sign Up for Vercel**
   - Go to https://vercel.com
   - Sign up with GitHub (recommended)

3. **Import Your Project**
   - Click "Add New Project"
   - Import your Git repository
   - Vercel will auto-detect Next.js

4. **Configure Environment Variables**
   In Vercel dashboard, add these environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live at `https://your-app.vercel.app`

6. **Update Supabase Settings** (Important!)
   - Go to Supabase Dashboard → Settings → API
   - Add your Vercel URL to "Redirect URLs" if using auth
   - Update `NEXT_PUBLIC_SITE_URL` in Vercel to match your domain

---

## Option 2: Netlify (Free Alternative)

### Steps:
1. Sign up at https://netlify.com
2. Connect your Git repository
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variables (same as Vercel)
5. Deploy

---

## Option 3: Railway (Free $5/month credit)

### Steps:
1. Sign up at https://railway.app
2. New Project → Deploy from GitHub
3. Add environment variables
4. Deploy

---

## Option 4: Render (Free tier available)

### Steps:
1. Sign up at https://render.com
2. New Web Service → Connect GitHub
3. Build command: `npm run build`
4. Start command: `npm start`
5. Add environment variables
6. Deploy

---

## Pre-Deployment Checklist

Before deploying, make sure:

- [ ] All environment variables are ready
- [ ] Database tables are created in Supabase
- [ ] Storage buckets are set up in Supabase
- [ ] RLS (Row Level Security) policies are configured
- [ ] Code is pushed to Git repository
- [ ] `.env.local` is NOT committed (it's in `.gitignore`)

---

## Post-Deployment Steps

1. **Update Supabase Redirect URLs**
   - Supabase Dashboard → Authentication → URL Configuration
   - Add your production URL: `https://your-app.vercel.app`

2. **Test Your Deployment**
   - Test user registration
   - Test login
   - Test service provider registration
   - Test image uploads (if using Supabase Storage)

3. **Set Up Custom Domain** (Optional)
   - Vercel/Netlify allow custom domains
   - Update DNS settings
   - Update `NEXT_PUBLIC_SITE_URL` environment variable

---

## Environment Variables for Production

Make sure these are set in your hosting platform:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_SITE_URL=https://your-production-url.com
```

**Important**: 
- `NEXT_PUBLIC_*` variables are exposed to the browser (safe for anon key)
- `SUPABASE_SERVICE_ROLE_KEY` should NEVER be exposed to client (server-side only)

---

## Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check Supabase project is active
- Verify RLS policies allow necessary operations

### Authentication Not Working
- Check redirect URLs in Supabase settings
- Verify `NEXT_PUBLIC_SITE_URL` matches your domain
- Check browser console for errors

---

## Quick Deploy Command (Vercel CLI)

If you prefer command line:

```bash
npm i -g vercel
vercel login
vercel
```

Follow the prompts and add environment variables when asked.

---

## Cost Comparison

| Platform | Free Tier | Best For |
|----------|-----------|----------|
| **Vercel** | ✅ Generous | Next.js apps |
| **Netlify** | ✅ Good | Static/SSG sites |
| **Railway** | $5/month credit | Full-stack apps |
| **Render** | Limited free | Small projects |

**Recommendation**: Start with **Vercel** - it's free and optimized for Next.js!

