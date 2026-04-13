import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from './components/ClientLayout';

export const metadata: Metadata = {
  title: 'ECONOBEN.DEV',
  description: 'Posts, talks, publications, and the work surrounding my upcoming O\u2019Reilly book on AI agent memory.',
  authors: [{ name: 'Benjamin Labaschin' }],
  keywords: ['econoben', 'AI/ML engineering', 'posts', 'talks', 'publications', 'agent memory', 'O\u2019Reilly'],
  manifest: '/manifest.json',
  openGraph: {
    title: 'ECONOBEN.DEV',
    description: 'Posts, talks, publications, and the work surrounding my upcoming O\u2019Reilly book on AI agent memory.',
    url: 'https://econoben.dev',
    siteName: 'ECONOBEN.DEV',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ECONOBEN.DEV',
    description: 'Posts, talks, publications, and the work surrounding my upcoming O\u2019Reilly book on AI agent memory.',
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
