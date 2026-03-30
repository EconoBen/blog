import type { Metadata } from 'next';
import { StitchCodeDetailPage } from '../../components/StitchPreviewPages';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `${decodeURIComponent(id)} | Code & Tools | ECONOBEN.DEV`,
    description: 'Literal Stitch desktop preview for the code and tools detail page.',
  };
}

export default async function CodeAIDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <StitchCodeDetailPage id={id} />;
}
