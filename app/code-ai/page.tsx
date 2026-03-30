import type { Metadata } from 'next';
import { StitchCodeIndexPage } from '../components/StitchPreviewPages';

export const metadata: Metadata = {
  title: 'Code & Tools | ECONOBEN.DEV',
  description: 'Literal Stitch desktop preview for the code and tools index.',
};

export default function CodeAIPage() {
  return <StitchCodeIndexPage />;
}
