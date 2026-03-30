import { postService } from './services/PostService';
import { MainContent } from './components/MainContent';

export default async function HomePage() {
  const posts = await postService.getRecentPosts(6);

  return <MainContent posts={posts} />;
}
