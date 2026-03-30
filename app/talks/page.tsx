import type { Metadata } from 'next';
import { StitchTalksPage } from '../components/StitchPreviewPages';

export const metadata: Metadata = {
  title: 'Talks | ECONOBEN.DEV',
  description: 'Literal Stitch desktop preview for the talks page.',
};

export default function TalksPage() {
  return <StitchTalksPage />;
}
