import type { Metadata } from 'next';
import { StitchPostsPage } from '../components/StitchPreviewPages';

export const metadata: Metadata = {
  title: 'Posts | ECONOBEN.DEV',
  description: 'Literal Stitch desktop preview for the posts index.',
};

export default function PostsPage() {
  return <StitchPostsPage />;
}
