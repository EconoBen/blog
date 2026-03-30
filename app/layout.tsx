import type { Metadata } from 'next';
import { Inter, Newsreader } from 'next/font/google';
import './globals.css';
import ClientLayout from './components/ClientLayout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
});

export const metadata: Metadata = {
  title: 'Ben Labaschin - Economics, AI & Tech Blog',
  description: "Ben Labaschin's blog on economics, AI, machine learning, and technology. Featuring insights on LLMs, personal finance, and software engineering.",
  authors: [{ name: 'Benjamin Labaschin' }],
  keywords: ['agent memory', 'AI systems', 'machine learning', 'technical writing', 'talks', 'publications'],
  manifest: '/manifest.json',
  openGraph: {
    title: 'Ben Labaschin - Economics, AI & Tech Blog',
    description: "Ben Labaschin's blog on economics, AI, machine learning, and technology. Featuring insights on LLMs, personal finance, and software engineering.",
    url: 'https://econoben.dev',
    siteName: 'Ben Labaschin - Economics, AI & Tech Blog',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ben Labaschin - Economics, AI & Tech Blog',
    description: "Ben Labaschin's blog on economics, AI, machine learning, and technology. Featuring insights on LLMs, personal finance, and software engineering.",
  },
  metadataBase: new URL('https://econoben.dev'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
