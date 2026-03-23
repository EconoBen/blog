import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from './components/ClientLayout';

export const metadata: Metadata = {
  title: 'ECONOBEN.DEV',
  description: 'Posts, talks, publications, and the forthcoming book on agent memory.',
  authors: [{ name: 'Benjamin Labaschin' }],
  keywords: ['econoben', 'technical editorial', 'posts', 'talks', 'publications', 'agent memory'],
  manifest: '/manifest.json',
  openGraph: {
    title: 'ECONOBEN.DEV',
    description: 'Posts, talks, publications, and the forthcoming book on agent memory.',
    url: 'https://econoben.dev',
    siteName: 'ECONOBEN.DEV',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ECONOBEN.DEV',
    description: 'Posts, talks, publications, and the forthcoming book on agent memory.',
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
      </body>
    </html>
  );
}
