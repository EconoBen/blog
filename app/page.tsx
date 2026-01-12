import Link from 'next/link';
import { postService } from './services/PostService';
import { MainContent } from './components/MainContent';
import MobileLayout from './components/MobileLayout';

export default async function HomePage() {
  const posts = await postService.getAllPosts();

  return (
    <MobileLayout>
      <MainContent posts={posts} />
    </MobileLayout>
  );
}