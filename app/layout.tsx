import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './components/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ben Labaschin - Economics, AI & Tech Blog',
  description: 'A blog about economics, technology, AI, and personal experiences.',
  authors: [{ name: 'Benjamin Labaschin' }],
  keywords: ['economics', 'technology', 'AI', 'machine learning', 'blog'],
  manifest: '/manifest.json',
  openGraph: {
    title: 'Ben Labaschin - Economics, AI & Tech Blog',
    description: 'A blog about economics, technology, AI, and personal experiences.',
    url: 'https://econoben.dev',
    siteName: 'Ben Labaschin - Economics, AI & Tech Blog',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ben Labaschin - Economics, AI & Tech Blog',
    description: 'A blog about economics, technology, AI, and personal experiences.',
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
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}