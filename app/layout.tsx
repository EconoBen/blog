import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Economic Notes - Exploring Economics, Technology, and Life",
  description: "A blog about economics, technology, and personal experiences. Written by a technology economist exploring the intersection of innovation and human behavior.",
  authors: [{ name: "Ben Labaschin" }],
  keywords: ["economics", "technology", "AI", "machine learning", "personal finance", "blog"],
  openGraph: {
    title: "Economic Notes",
    description: "Exploring Economics, Technology, and Life",
    url: "https://econoben.dev",
    siteName: "Economic Notes",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Economic Notes",
    description: "Exploring Economics, Technology, and Life",
    creator: "@bjl",
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
  alternates: {
    canonical: "https://econoben.dev",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="blog-container">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}