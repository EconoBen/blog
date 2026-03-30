import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search | ECONOBEN.DEV',
  description: 'Search posts, talks, publications, and tools across ECONOBEN.DEV.',
};

export default function SearchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
