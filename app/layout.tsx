import type { Metadata } from 'next';
import { Inter, Newsreader } from 'next/font/google';
import './globals.css';
import ClientLayout from './components/ClientLayout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const newsreader = Newsreader({ subsets: ['latin'], variable: '--font-newsreader' });

export const metadata: Metadata = {
  title: 'ECONOBEN.DEV',
  description: 'Posts, talks, publications, technical tools, and the forthcoming book preview in a literal Stitch TSX pass.',
  authors: [{ name: 'Benjamin Labaschin' }],
  keywords: ['econoben', 'technical editorial', 'posts', 'talks', 'publications', 'code and tools', 'agent memory'],
  manifest: '/manifest.json',
  openGraph: {
    title: 'ECONOBEN.DEV',
    description: 'Posts, talks, publications, technical tools, and the forthcoming book preview in a literal Stitch TSX pass.',
    url: 'https://econoben.dev',
    siteName: 'ECONOBEN.DEV',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ECONOBEN.DEV',
    description: 'Posts, talks, publications, technical tools, and the forthcoming book preview in a literal Stitch TSX pass.',
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
      <body className={`${inter.variable} ${newsreader.variable}`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
