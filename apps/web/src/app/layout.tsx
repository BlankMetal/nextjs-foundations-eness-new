import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import { GoogleAnalytics } from "../components/google-analytics";

// Variable font — all weights (100–900) in a single file, fewer network requests
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: true,
});

// Monospace font for code blocks
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "Vercel Academy Foundation - Web",
  description: "VAF Web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="container mx-auto px-4 py-8 font-sans">
        {children}
        {/* Vercel Speed Insights: tracks Core Web Vitals in production dashboard */}
        <SpeedInsights />
        {/* Vercel Analytics: tracks page views and visitor data */}
        <Analytics />
        {/* Google Analytics — client component for onLoad support */}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
