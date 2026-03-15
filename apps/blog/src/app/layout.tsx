import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  // metadataBase turns relative URLs (like "/og.png") into absolute ones.
  // Without this, OpenGraph images and canonical URLs break.
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3001'
  ),

  // Title template: child pages supply the %s part.
  // e.g., a page with title "My Post" becomes "My Post | VAF Blog"
  title: {
    template: '%s | VAF Blog',
    default: 'Vercel Academy Foundation - Blog',
  },
  description: 'Articles and tutorials from the VAF team',

  // Default OpenGraph values inherited by all pages unless overridden
  openGraph: {
    siteName: 'VAF Blog',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="container mx-auto px-4 py-8">{children}</body>
    </html>
  );
}
