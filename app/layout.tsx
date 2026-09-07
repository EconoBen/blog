import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import './styles/field-notes.css';
import './styles/living-pond.css';
import './styles/publication-refinements.css';
import ClientLayout from './components/ClientLayout';
import { SITE_IDENTITY, SITE_SOCIAL_IMAGE } from './config/siteIdentity';

export const metadata: Metadata = {
  title: SITE_IDENTITY.title,
  description: SITE_IDENTITY.description,
  authors: [{ name: 'Ben Labaschin' }],
  keywords: ['econoben', 'AI/ML engineering', 'posts', 'talks', 'publications', 'agent memory', 'AI agents', 'O\u2019Reilly'],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/grebe-v1-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icons/grebe-v1.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
    shortcut: '/favicon.ico?v=grebe-v1',
    apple: [{ url: '/icons/grebe-v1-180.png', type: 'image/png', sizes: '180x180' }],
  },
  openGraph: {
    title: SITE_IDENTITY.title,
    description: SITE_IDENTITY.description,
    url: 'https://econoben.dev',
    siteName: SITE_IDENTITY.name,
    locale: 'en_US',
    type: 'website',
    images: [SITE_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_IDENTITY.title,
    description: SITE_IDENTITY.description,
    images: [SITE_SOCIAL_IMAGE.url],
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
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
      </body>
    </html>
  );
}
