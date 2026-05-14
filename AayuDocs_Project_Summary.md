# AayuDocs - Project Architecture & Technical Summary

## 1. Project Overview
AayuDocs is a premium, all-in-one, AI-powered document processing SaaS platform. Designed to rival industry leaders like iLovePDF and SmallPDF, AayuDocs provides users with secure, client-side, and cloud-assisted document conversions, merges, compressions, image formatting, and OCR capabilities within a beautiful, modern user interface.

## 2. Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui, Framer Motion
- **Database**: PostgreSQL (via Prisma ORM v7)
- **Authentication**: Clerk
- **State Management**: Zustand
- **Forms & Validation**: React Hook Form, Zod
- **Core Processing Libraries**: `pdf-lib`, `pdfjs-dist`, `browser-image-compression`, `tesseract.js`, `TipTap` (for Document Editor)
- **Deployment**: Vercel (Frontend/Middleware) & AWS/Neon (Database)

## 3. Features Implemented
- **20+ Document & Image Tools**: Merge, Split, Compress, Image Conversion, Resume Builder, OCR, QR Code Generator, etc.
- **AI Tool Suite**: AI PDF Summary, Resume Builder, Notes Generator, OCR Enhancement, Background Removal.
- **Client-Side Processing Architecture**: Maximizes privacy by processing standard PDF manipulations entirely in the browser.
- **Robust Authentication**: Protected routes via Clerk middleware.
- **Comprehensive Admin Dashboard**: Modules for User Management, Revenue Analytics, SEO Settings, and Tool Usage.
- **SEO Optimized Blog System**: Full CMS with tags, categories, search, and related posts.
- **Premium UI/UX**: Dark mode support, glassmorphism, micro-interactions, and glowing premium AI cards.
- **Production Optimizations**: Code-splitting, dynamic imports, next/image optimization, error boundaries, and CSP security headers.

## 4. Folder Structure
```text
AayuDocs/
├── prisma/                 # Database schemas and migrations
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router (Pages & Layouts)
│   │   ├── (public)/       # Marketing pages
│   │   ├── admin/          # Protected Admin Dashboard
│   │   ├── blog/           # Dynamic SEO Blog System
│   │   ├── tools/          # Dynamic Tool Routes
│   ├── components/         # Reusable UI Components
│   │   ├── sections/       # Hero, Grid, Features, Footer
│   │   ├── shared/         # ToolRenderer, DocumentEditor, ThemeToggle
│   │   └── ui/             # Shadcn primitives
│   ├── config/             # Constants and Tool configurations
│   ├── hooks/              # Zustand global state & custom hooks
│   ├── lib/                # Utilities, DB Singletons, Validations
│   └── services/           # Processing Logic (PDF, Image, OCR, Blog)
└── next.config.ts          # Build, Image, & Security configuration
```

## 5. UI Sections
- **Marketing Homepage**: Sticky Glass Navbar, Hero Section, Popular Tools Grid, Feature Highlights, How It Works, Testimonials, FAQ, and Footer.
- **Admin Layout**: Responsive Sidebar, Metrics Overview Cards, Data Tables.
- **Blog Archive**: Featured post grid, sidebar search, and category aggregation.

## 6. All Tool Features
1. Word to PDF
2. PDF to Word
3. Merge PDF
4. Split PDF
5. PDF Compress
6. PDF Rotate
7. PDF Unlock
8. PDF Protect
9. Watermark PDF
10. JPG to PNG / PNG to JPG / WEBP Converter / HEIC to JPG
11. Compress Image / Resize Image / Crop Image
12. OCR Scanner
13. Document Editor (TipTap)
14. QR Generator
15. ZIP Extractor

## 7. AI Features (Premium Modules)
1. **AI PDF Summary**: Summarizes long documents.
2. **AI Resume Builder**: Generates ATS-friendly resumes.
3. **AI Notes Generator**: Transcribes and structures study notes.
4. **AI OCR Enhancement**: Fixes formatting and typos in scanned text.
5. **AI Background Removal**: Precise edge-detection for image cutouts.

## 8. Authentication System
Powered by **Clerk**. Features include:
- Google / GitHub Single Sign-On (SSO).
- Magic Links & Email/Password setup.
- Route Protection via `middleware.ts`.
- Profile management via standard `<UserButton />`.

## 9. Database Architecture
PostgreSQL modeled via Prisma:
- `User`: Synchronized with Clerk accounts.
- `File`: Tracking metadata of processed files.
- `Conversion`: Audit trails of executed tools.
- `Subscription`: Manages Pro vs Free tier constraints via Stripe Webhooks.
- `Blog`: Houses the SEO article content.
- `ToolUsage`: Analytics tracker for admin dashboard metrics.

## 10. APIs Used
- **Currently Active**: Clerk Auth, Local Prisma Postgres, Unsplash (Mock images).
- **Required for Production**: Stripe (Billing), Resend (Emails), OpenAI/Anthropic (AI Features), AWS S3/Cloudflare R2 (Storage).

## 11. File Processing Architecture
AayuDocs employs a hybrid processing model. Whenever possible, processing happens inside the user's browser via WebAssembly or optimized JS modules (e.g. `pdf-lib`). Only complex tasks (AI logic, heavily encrypted PDFs) are delegated to the server to save bandwidth and compute costs.

## 12. Browser-side vs Server-side Processing
- **Browser-side**: PDF Merging, Splitting, Rotating, Image Resizing, Basic OCR (via `tesseract.js` worker), TipTap Rich Text Export.
- **Server-side (Planned)**: AI PDF Summarization, AI Background Removal, highly secure PDF Password stripping.

## 13. Security Features
- **Data Privacy**: Client-side execution ensures files never touch the server for standard tools.
- **HTTP Headers**: Strict `X-Frame-Options`, `Content-Security-Policy`, and `Permissions-Policy`.
- **Route Guards**: Clerk JWT verification protects `/admin` and `/dashboard`.

## 14. SEO Setup
- Dynamic Metadata generation for Blog categories and individual Posts.
- Standardized OpenGraph variables.
- Configurable `robots.txt` and `sitemap.xml` management from the Admin panel.
- Semantic HTML5 structure (H1 hierarchy, `<article>`, `<nav>`).

## 15. Deployment Architecture
- **Frontend / Edge**: Vercel (optimally utilizes Next.js App Router).
- **Database**: Neon (Serverless Postgres) or Supabase.
- **Blob Storage**: AWS S3 or Cloudflare R2 (for temporary server-side processing artifacts).

## 16. Performance Optimizations
- **Image Optimization**: `<Image />` tags across the platform with explicit size constraints.
- **Code Splitting**: Dynamic importing (`next/dynamic`) of the TipTap DocumentEditor.
- **React Hydration**: Client components strictly cordoned via `"use client"`.

## 17. Remaining Tasks
- Database Provisioning & initial Prisma Migration.
- Wiring Stripe Webhooks to update the `Subscription` model.
- Implementing the live LLM API calls for the 5 AI tools (replacing current UI mock).
- Connecting the Admin Dashboard charts to real Prisma aggregation queries.

## 18. Future Improvements
- Desktop Application (Electron/Tauri) wrap.
- Chrome Extension for rapid conversions.
- Collaborative Document Editing (WebSockets via Yjs).
- Enterprise Team accounts with shared branding constraints.

## 19. Monetization Ideas
- **Freemium Model**: 3 free tasks per day.
- **AayuDocs Pro**: $10/mo for unlimited tasks, batch processing, and unlocking AI features.
- **API Access**: Developer API billing for volume document processing.

## 20. Admin Panel Features
- Analytics Overview (Users, MRR, File Processing Volume).
- User Management (Ban/Suspend, Upgrade tier).
- Tool Analytics (Usage metrics, error rates).
- Revenue tracking (Transaction logs).
- Blog CMS (Create, edit, publish posts).
- Global SEO settings management.

## 21. Environment Variables Needed
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
DATABASE_URL=
NEXT_PUBLIC_APP_URL=https://aayudocs.com
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
OPENAI_API_KEY=
AWS_S3_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

## 22. Third-party Services Required
- Clerk, Stripe, Neon/Supabase, Vercel, AWS S3, OpenAI, Resend.

## 23. Hosting Recommendations
- **Frontend**: Vercel (Pro Tier).
- **Database**: Neon Database for serverless edge scaling.
- **Storage**: Cloudflare R2 (zero egress fees for file conversions).

## 24. Estimated Scaling Plan
- **Phase 1 (0-10k MAU)**: Rely heavily on client-side JS. Vercel serverless functions handle API integrations.
- **Phase 2 (10k-100k MAU)**: Implement Redis caching for Blog content and rate limiting. Move intensive AI/PDF queues to a dedicated background worker (e.g. Inngest / AWS SQS).
- **Phase 3 (100k+ MAU)**: Dedicated ECS/Kubernetes instances for intensive PDF/Video conversions.

## 25. Production Checklist
- [x] Responsive Design verified
- [x] Client-side routing functional
- [x] Security headers active
- [x] Code split heavy modules
- [ ] Connect Live Database
- [ ] Implement Live LLM API Keys
- [ ] Connect Stripe webhooks
- [ ] Define Terms of Service & Privacy Policy pages
- [ ] Setup production Error tracking (e.g. Sentry)
