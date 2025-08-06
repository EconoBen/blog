import Link from 'next/link';
import { postService } from './services/PostService';
import Sidebar from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { SidebarToggle } from './components/SidebarToggle';
import MobileLayout from './components/MobileLayout';

export default async function HomePage() {
  const posts = await postService.getAllPosts();
  
  // Get recent posts (first 10) for sidebar
  const recentPosts = posts.slice(0, 10);

  return (
    <MobileLayout>
      <div className="blog-container">
        <Sidebar posts={recentPosts} />
        <MainContent posts={posts} />
        <SidebarToggle />
      </div>
    </MobileLayout>
  );
}