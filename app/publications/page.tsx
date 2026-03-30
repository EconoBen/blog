import type { Metadata } from 'next';
import { StitchPublicationsPage } from '../components/StitchPreviewPages';

export const metadata: Metadata = {
  title: 'Publications | ECONOBEN.DEV',
  description: 'Literal Stitch desktop preview for the publications page.',
};

export default function PublicationsPage() {
  return <StitchPublicationsPage />;
}
