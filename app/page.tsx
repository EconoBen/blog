import { postService } from './services/PostService';
import { ShellHomePage } from './components/ShellHomePage';

export default async function HomePage() {
  const posts = await postService.getAllPosts();

  return (
    <ShellHomePage posts={posts} />
  );
}
