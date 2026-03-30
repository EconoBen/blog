import type { Metadata } from 'next';
import { StitchArchiveMonthPage } from '../../components/StitchPreviewPages';

export async function generateMetadata({ params }: { params: Promise<{ month: string }> }): Promise<Metadata> {
  const { month } = await params;

  return {
    title: `${month} | Archive | ECONOBEN.DEV`,
    description: 'Literal Stitch desktop preview for the archive month page.',
  };
}

export default async function ArchiveMonthPage({ params }: { params: Promise<{ month: string }> }) {
  const { month } = await params;

  return <StitchArchiveMonthPage month={month} />;
}
