import type { Metadata } from 'next';
import { StitchTagsPage } from '../components/StitchPreviewPages';

export const metadata: Metadata = {
  title: 'Tags | ECONOBEN.DEV',
  description: 'Literal Stitch desktop preview for the tags index.',
};

export default function TagsPage() {
  return <StitchTagsPage />;
}
