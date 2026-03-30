import Link from 'next/link';
import { postService } from './services/PostService';
import Sidebar from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { SidebarToggle } from './components/SidebarToggle';
import NavBar from './components/NavBar';

export default async function HomePage() {
  const posts = await postService.getAllPosts();
  
  // Get recent posts (first 10) for sidebar
  const recentPosts = posts.slice(0, 10);

  return (
    <div className="blog-container">
      {/* Production-matching layout: Sidebar + Main Content */}
      <Sidebar posts={recentPosts} />

      {/* Main content area with navbar */}
      <div className="main-content">
        <NavBar />
        <MainContent posts={posts} />
      </div>

      {/* Sidebar toggle for mobile */}
      <SidebarToggle />
    </div>
  );
}