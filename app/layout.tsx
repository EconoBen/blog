import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import ClientLayout from './components/ClientLayout';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ben Labaschin | Technical Editorial Platform',
  description: 'Posts, talks, publications, code, and a forthcoming book on agent memory.',
  authors: [{ name: 'Benjamin Labaschin' }],
  keywords: ['agent memory', 'AI systems', 'machine learning', 'technical writing', 'talks', 'publications'],
  manifest: '/manifest.json',
  openGraph: {
    title: 'Ben Labaschin | Technical Editorial Platform',
    description: 'Posts, talks, publications, code, and a forthcoming book on agent memory.',
    url: 'https://econoben.dev',
    siteName: 'Ben Labaschin | Technical Editorial Platform',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ben Labaschin | Technical Editorial Platform',
    description: 'Posts, talks, publications, code, and a forthcoming book on agent memory.',
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
      <body className={manrope.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
