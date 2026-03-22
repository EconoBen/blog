import { postService } from './services/PostService';
import { MainContent } from './components/MainContent';

export default async function HomePage() {
  const posts = await postService.getAllPosts();

  return (
    <MainContent posts={posts} />
  );
}
