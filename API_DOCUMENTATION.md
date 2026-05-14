# AayuDocs Internal API Documentation

## 1. File Processing Modules
*Note: Most standard operations are performed client-side using WebAssembly modules (`pdf-lib`, `browser-image-compression`) for zero-latency, secure document handling.*

### PDF Processing (`src/services/pdf.ts`)
- **`processPdfTool(files: File[], toolSlug: string): Promise<string>`**
  - Handles routing logic for standard PDF tools.
  - Returns a blob URL for immediate user download.
- **`mergePdfs(files: File[])`**
  - Utilizes `pdf-lib` to stitch multiple arrays into a new `PDFDocument`.

### Image Processing (`src/services/image.ts`)
- **`processImageTool(files: File[], toolSlug: string): Promise<string>`**
  - Routes transformations including `compress-image`, `resize-image`, `crop-image`.

### OCR Processing (`src/services/ocr.ts`)
- **`processOcrTool(file: File, language: string, progressCallback: Function): Promise<string>`**
  - Spins up a `tesseract.js` web worker to process images/PDFs into structured text strings.

## 2. Server-Side Services
### Blog API (`src/services/blog.ts`)
- **`getPublishedPosts(query?, category?, page?, limit?)`**
  - Fetches paginated, filtered Prisma objects from the database.
- **`getPostBySlug(slug: string)`**
  - Retrieves a specific blog post and its relational Author fields.

## 3. Webhooks
*(Pending Implementation during final Stripe/Clerk setup)*
- **`POST /api/webhooks/clerk`**: Syncs user creation/deletion into the Prisma `User` table.
- **`POST /api/webhooks/stripe`**: Listens for `checkout.session.completed` and upgrades the `Subscription` tier in the DB.
