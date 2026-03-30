import type { Metadata } from 'next';
import { StitchAboutPage } from '../components/StitchPreviewPages';

export const metadata: Metadata = {
  title: 'About | ECONOBEN.DEV',
  description: 'Literal Stitch desktop preview for the about / CV page.',
};

export default function AboutPage() {
  return <StitchAboutPage />;
}
