import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { siteConfig } from "@/config/site";
import { ClerkProvider } from '@clerk/nextjs';

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "PDF tools",
    "convert PDF to Word",
    "Word to PDF",
    "merge PDF files",
    "compress PDF",
    "split PDF",
    "OCR PDF",
    "AI document editor",
    "AayuDocs",
    "free PDF converter",
    "secure document processing",
    "online PDF editor",
    "rotate PDF",
    "watermark PDF",
    "image to PDF",
    "unlock PDF",
    "protect PDF",
  ],
  authors: [
    {
      name: "AayuDocs",
      url: siteConfig.url,
    },
  ],
  creator: "AayuDocs",
  publisher: "AayuDocs",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/og.png"],
    creator: "@aayudocs",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { headers } from "next/headers";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Analytics } from "@vercel/analytics/next";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") || "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans antialiased min-h-screen bg-background text-foreground`}>
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {!isAdmin && <Navbar />}
            <main className="flex-1">
              {children}
            </main>
            {!isAdmin && <Footer />}
            <Analytics />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
