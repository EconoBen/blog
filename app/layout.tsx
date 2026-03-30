import type { Metadata, Viewport } from 'next';
import ClientLayout from './components/ClientLayout';

// Match production head tags for parity
export const metadata: Metadata = {
  title: 'Ben Labaschin - Economics, AI & Tech Blog',
  description:
    "Ben Labaschin's blog on economics, AI, machine learning, and technology. Featuring insights on LLMs, personal finance, and software engineering.",
  authors: [{ name: 'Ben Labaschin' }],
  keywords: ['economics', 'technology', 'AI', 'machine learning', 'blog'],
  manifest: '/manifest.json',
  metadataBase: new URL('https://econoben.dev'),
  openGraph: {
    title: 'Ben Labaschin - Economics, AI & Tech Blog',
    description:
      "Ben Labaschin's blog on economics, AI, machine learning, and technology. Featuring insights on LLMs, personal finance, and software engineering.",
    url: 'https://econoben.dev',
    siteName: 'econoben.dev',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ben Labaschin - Economics, AI & Tech Blog',
    description:
      "Ben Labaschin's blog on economics, AI, machine learning, and technology. Featuring insights on LLMs, personal finance, and software engineering.",
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/static/css/main.da68fc15.css" />
      </head>
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
