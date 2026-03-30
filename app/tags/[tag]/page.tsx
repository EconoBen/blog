import type { Metadata } from 'next';
import { StitchTagDetailPage } from '../../components/StitchPreviewPages';

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;

  return {
    title: `${decodeURIComponent(tag)} | Tags | ECONOBEN.DEV`,
    description: 'Literal Stitch desktop preview for the tag detail page.',
  };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;

  return <StitchTagDetailPage tag={tag} />;
}
