import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import ClientLayout from './components/ClientLayout';

export const metadata: Metadata = {
  title: 'ECONOBEN.DEV',
  description: 'AI/ML engineering, posts, talks, tools, and Agent Memory — now in Early Release from O\u2019Reilly.',
  authors: [{ name: 'Benjamin Labaschin' }],
  keywords: ['econoben', 'AI/ML engineering', 'posts', 'talks', 'publications', 'agent memory', 'AI agents', 'O\u2019Reilly'],
  manifest: '/manifest.json',
  openGraph: {
    title: 'ECONOBEN.DEV',
    description: 'AI/ML engineering, posts, talks, tools, and Agent Memory — now in Early Release from O\u2019Reilly.',
    url: 'https://econoben.dev',
    siteName: 'ECONOBEN.DEV',
    locale: 'en_US',
    type: 'website',
    images: [{ url: 'https://econoben.dev/og-image.png', width: 1200, height: 630, alt: 'ECONOBEN.DEV — AI/ML Engineering & Writing' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ECONOBEN.DEV',
    description: 'AI/ML engineering, posts, talks, tools, and Agent Memory — now in Early Release from O\u2019Reilly.',
    images: ['https://econoben.dev/og-image.png'],
  },
  metadataBase: new URL('https://econoben.dev'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
        <Analytics />
      </body>
    </html>
  );
}
