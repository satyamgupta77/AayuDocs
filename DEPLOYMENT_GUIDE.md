# AayuDocs Deployment Guide

## 1. Hosting Environment
We highly recommend deploying the Next.js frontend to **Vercel** and the PostgreSQL database to **Neon** or **Supabase**.

## 2. Vercel Deployment Steps
1. Push your code to a GitHub repository.
2. Log into [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. Configure the Build Settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Install Command: `npm install`
5. **Add Environment Variables**: Paste all variables from your `.env.local` into the Vercel Environment Variables section.
6. Click **Deploy**.

## 3. Database Migration in Production
Since Vercel creates isolated serverless instances, your database must be migrated. Add a custom build script in your `package.json` to handle Prisma migrations automatically during deployment:
```json
"scripts": {
  "postinstall": "prisma generate",
  "build": "prisma migrate deploy && next build"
}
```

## 4. Setting up Webhooks (Stripe / Clerk)
- Add your live production URL (e.g., `https://aayudocs.com`) to the Clerk Dashboard as your Instance URL.
- Configure Stripe Webhooks to point to `https://aayudocs.com/api/webhooks/stripe` and update the `STRIPE_WEBHOOK_SECRET` in Vercel.

## 5. Domain Configuration
1. Go to Vercel Project Settings > Domains.
2. Add your custom domain (e.g., `aayudocs.com`).
3. Follow the DNS instructions to point your domain to Vercel's nameservers.
