import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { siteConfig } from "@/config/site";
import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/next';

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "PDF tools",
    "convert PDF",
    "merge PDF",
    "compress image",
    "document workspace",
  ],
  authors: [
    {
      name: "AayuDocs",
      url: siteConfig.url,
    },
  ],
  creator: "AayuDocs",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
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
    images: [siteConfig.ogImage],
    creator: "@aayudocs",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

import { headers } from "next/headers";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

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
          </ThemeProvider>
        </ClerkProvider>
        <Analytics />
      </body>
    </html>
  );
}
