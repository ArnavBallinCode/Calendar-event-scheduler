# Deployment Guide

## Deploying to Vercel

This app is built with Next.js and is optimized for deployment on Vercel.

### Step 1: Push to GitHub

1. Create a GitHub repository
2. Push your code to the repository

### Step 2: Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a Next.js project

### Step 3: Add Environment Variables

In the Vercel project settings, add:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

Get these values from your Supabase project settings.

### Step 4: Deploy

Click "Deploy" and Vercel will build and deploy your app automatically.

Your app will be live at `https://your-project.vercel.app`

## Supabase Setup

### Create a Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Click "New Project"
3. Enter project details and create
4. Wait for the project to be provisioned

### Run Database Setup

1. In Supabase dashboard, go to SQL Editor
2. Create a new query
3. Copy and run `scripts/01_create_tables.sql`
4. Create another query
5. Copy and run `scripts/02_profile_trigger.sql`

### Get API Keys

In your Supabase project:
1. Go to Settings → API
2. Copy "Project URL" → NEXT_PUBLIC_SUPABASE_URL
3. Copy "anon public" key → NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Copy "service_role secret" → SUPABASE_SERVICE_ROLE_KEY

## Email Confirmation (Optional)

By default, Supabase requires email confirmation for signups. If you want to disable this:

1. Go to Supabase Dashboard → Authentication → Providers
2. Disable "Email Verification"

(Note: This is less secure, only do for testing)

## Custom Domain

To use a custom domain:

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Update DNS records as instructed
4. Vercel will provision SSL automatically

## Monitoring

- Use Vercel's built-in analytics
- Monitor Supabase database usage in dashboard
- Check logs in Vercel Deployments tab

## Troubleshooting

### "Database connection failed"
- Verify environment variables are set correctly
- Check Supabase project is running
- Verify database tables exist using SQL Editor

### "Auth redirect failed"
- Make sure `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` is set correctly
- For production, update to your actual domain
- Verify redirect URL is registered in Supabase email templates

### "RLS policy violation"
- Check that user is authenticated
- Verify email is confirmed (if email verification enabled)
- Check RLS policies allow the operation
