# AayuDocs Setup Guide

## 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git
- PostgreSQL instance (local or hosted like Neon/Supabase)

## 2. Environment Setup
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd aayudocs
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
4. Fill in the required credentials in `.env.local`:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY`: Get from [Clerk Dashboard](https://dashboard.clerk.com).
   - `OPENAI_API_KEY`: Required for AI tools.

## 3. Database Initialization
Run the Prisma migrations to create the required tables:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

## 4. Running Locally
Start the development server:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.
