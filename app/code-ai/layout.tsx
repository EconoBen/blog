import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Code & Tools | ECONOBEN.DEV',
  description: 'Code notes, snippets, and tools collected on ECONOBEN.DEV.',
};

export default function CodeAISectionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
