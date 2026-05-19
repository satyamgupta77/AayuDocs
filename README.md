<div align="center">
  <img src="public/logo.png" alt="AayuDocs Logo" width="120" height="120" />
  <h1>📄 AayuDocs</h 1>
  <p><strong>The Ultimate Intelligent Document Workspace & Premium AI SaaS Platform</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16%20App%20Router-black?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma" alt="Prisma" />
    <img src="https://img.shields.io/badge/Database-Neon%20Postgres-00E599?style=flat-square&logo=postgresql" alt="Neon Postgres" />
    <img src="https://img.shields.io/badge/Auth-Clerk%20v7-6C47FF?style=flat-square&logo=clerk" alt="Clerk Auth" />
    <img src="https://img.shields.io/badge/Payments-Razorpay-0284C7?style=flat-square&logo=razorpay" alt="Razorpay" />
  </p>
</div>

<hr />

## 🌟 Overview

**AayuDocs** is a cutting-edge, high-fidelity SaaS web application designed to handle end-to-end document processing, live file editing, multi-format exports, and AI-augmented generation pipelines. Built strictly on top of the **Next.js App Router** framework, it features lightning-fast server-side rendering, highly resilient component design, modern rich UI systems (Glassmorphism & dark themes), and direct integration with premier external infrastructure providers.

---

## ⚡ Core Modules & Features

### 🛠️ 1. Multi-Format Processing Suite
- **PDF Operations**: Native integrations for *Word to PDF*, *PDF to Word*, *Merge PDF*, and *Split PDF*.
- **Image Optimization**: Automated compression pipelines (*Compress Image*, *Image to PDF*) ensuring absolute size compliance without pixelation degradation.
- **Advanced OCR Recognition**: Deep text extractors utilizing visual layer inspection to extract unstructured image text automatically.

### 📝 2. TipTap Powered Document Editor
- Clean, uncluttered **Google Docs aesthetic** providing premium editing continuity.
- Features multi-format exports natively translating client document blocks directly to optimized `.docx` and `.pdf` binaries on demand.

### 🤖 3. Glowing Premium AI Modules
A sophisticated set of state-of-the-art tools guarded behind recurring pro tiers:
- **AI PDF Summary**: Deep text summarization analyzing large-scale unstructured uploads.
- **AI Resume Builder**: Contextual structured resume template assemblers.
- **AI Notes Generator**: Intelligent markdown bullet generator mapping core topical themes.
- **AI OCR Enhancement & Background Removal**: Automated pixel cleanups and isolation layers.

### 💳 4. Enterprise Monetization Architecture (Razorpay)
- **Recurring Tier Plans**: Distinct access scopes supporting dynamic Monthly and Yearly checkout variants mapped to active INR scaling.
- **Native Verification Webhooks**: Crypto signature HMAC evaluation guaranteeing server-to-server transaction tracking (*Subscription Charged / Activated / Cancelled*).
- **Pro Feature Guarding**: Component-level middleware cordoning premium tools securely inside interactive upgrade modals for free-tier users.

### 📊 5. Administrative Dashboard
- Complete analytical oversight tracking total live conversions, dynamic signup charts, user session history, and total revenue aggregation.

---

## 🏗️ Technical Architecture

```
AayuDocs/
├── prisma/
│   └── schema.prisma         # Centralized database models & relations
├── public/
│   └── logo.png              # Custom generated brand vector icon
├── src/
│   ├── app/                  # Next.js App Router root directories
│   │   ├── admin/            # Secure Super-Admin analytical portal
│   │   ├── api/              # Server-side API endpoints & Razorpay Hooks
│   │   ├── dashboard/        # Client dashboard & billing operations
│   │   ├── tools/            # Dynamic SEO prerendered tool sections
│   │   └── proxy.ts          # Centralized Clerk Auth routing proxy
│   ├── components/           # Reusable application UI elements
│   ├── config/               # Navigation, SEO headers, and Tool definitions
│   ├── lib/                  # Native Singleton instances (Prisma, Razorpay, OpenAI)
│   └── services/             # Abstraction services communicating with Postgres
└── .env.local                # Local staging and production runtime variables
```

---

## 🚀 Quickstart Guide

### Prerequisites
Make sure you have **Node.js 18+** installed along with your preferred package manager (`npm`, `yarn`, `pnpm`).

### 1. Clone the Repository
```bash
git clone https://github.com/satyamgupta77/AayuDocs.git
cd AayuDocs
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory following the provided `.env.example` structure:
```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:npg_G8HE4aUeLNyu@ep-gentle-hat-aqm4vst0-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Payments (Razorpay)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
NEXT_PUBLIC_RAZORPAY_MONTHLY_PLAN_ID=plan_...
NEXT_PUBLIC_RAZORPAY_YEARLY_PLAN_ID=plan_...

# Supabase Storage & AI Engine
NEXT_PUBLIC_SUPABASE_URL=https://packzhdrrktkieznndba.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_nJMurD5toY2Z6DyWP_kTiQ_9j4JPn4E
OPENAI_API_KEY=sk-proj-...
```

### 4. Synchronize Database Models
Ensure your Prisma schema maps seamlessly to your provisioned cloud database instance:
```bash
npx prisma generate
npx prisma db push
```

### 5. Launch the Local Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your web browser to explore your fully integrated SaaS ecosystem.

---

## 🛡️ Best Practices & Quality Standard
- **SEO & Social OpenGraph**: Pre-configured global layout templates outputting highly explicit metadata schemas natively targeting standard indexing rules.
- **Accessibility (A11y)**: Compliant screen-reader interactions built atop modern headless primitives.
- **Strict Builds**: Zero unhandled typing assertions passing deep Turbopack collection validation successfully.

---

## 📄 License
This repository and its associated core architecture are proprietary to **AayuDocs**. Distributed under strict deployment permission boundaries.
