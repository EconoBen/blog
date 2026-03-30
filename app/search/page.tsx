import type { Metadata } from 'next';
import { StitchSearchPage } from '../components/StitchPreviewPages';

export const metadata: Metadata = {
  title: 'Search | ECONOBEN.DEV',
  description: 'Literal Stitch desktop preview for the search page.',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return <StitchSearchPage query={q} />;
}
