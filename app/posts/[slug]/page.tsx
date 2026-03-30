import type { Metadata } from 'next';
import { StitchPostDetailPage } from '../../components/StitchPreviewPages';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `${decodeURIComponent(slug)} | Posts | ECONOBEN.DEV`,
    description: 'Literal Stitch desktop preview for the post detail page.',
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return <StitchPostDetailPage slug={slug} />;
}
