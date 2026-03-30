import type { Metadata } from 'next';
import { StitchArchivePage } from '../components/StitchPreviewPages';

export const metadata: Metadata = {
  title: 'Archive | ECONOBEN.DEV',
  description: 'Literal Stitch desktop preview for the archive index.',
};

export default function ArchivePage() {
  return <StitchArchivePage />;
}
