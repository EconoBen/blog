import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './components/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Economic Notes - Exploring Economics, Technology, and Life',
  description: 'A blog about economics, technology, and personal experiences.',
  authors: [{ name: 'Benjamin Labaschin' }],
  keywords: ['economics', 'technology', 'AI', 'machine learning', 'blog'],
  manifest: '/manifest.json',
  openGraph: {
    title: 'Economic Notes',
    description: 'A blog about economics, technology, and personal experiences.',
    url: 'https://econoben.dev',
    siteName: 'Economic Notes',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Economic Notes',
    description: 'A blog about economics, technology, and personal experiences.',
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