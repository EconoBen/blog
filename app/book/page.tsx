import type { Metadata } from 'next';
import { StitchBookPage } from '../components/StitchPreviewPages';

export const metadata: Metadata = {
  title: 'Book | ECONOBEN.DEV',
  description: 'Literal Stitch desktop preview for the book page.',
};

export default function BookPage() {
  return <StitchBookPage />;
}
