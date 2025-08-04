import Link from 'next/link';
import { postService } from './services/PostService';

export default async function HomePage() {
  const posts = await postService.getAllPosts();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Economic Notes
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Exploring Economics, Technology, and Life
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <Link href={`/posts/${post.slug}`} className="block">
                <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
                <time className="text-sm text-gray-500 dark:text-gray-400">
                  {post.date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                {post.summary && (
                  <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-3">
                    {post.summary}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}