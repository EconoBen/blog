import { notFound } from 'next/navigation';
import { postService } from '@/app/services/PostService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { Metadata } from 'next';

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await postService.getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const imageUrl = post.coverImage 
    ? `https://econoben.dev${post.coverImage}`
    : (() => {
        const ogImageParams = new URLSearchParams({
          title: post.title,
          date: post.date.toISOString(),
          tags: post.tags.join(','),
          ...(post.summary && { summary: post.summary }),
        });
        return `https://econoben.dev/api/og?${ogImageParams.toString()}`;
      })();

  return {
    title: `${post.title} | Economic Notes`,
    description: post.summary || `Read "${post.title}" on Economic Notes`,
    openGraph: {
      title: post.title,
      description: post.summary || `Read "${post.title}" on Economic Notes`,
      type: 'article',
      publishedTime: post.date.toISOString(),
      authors: ['Ben Labaschin'],
      tags: post.tags,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary || `Read "${post.title}" on Economic Notes`,
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams() {
  const posts = await postService.getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await postService.getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
          <time>
            {post.date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span>•</span>
          <div className="flex gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full rounded-lg mb-8"
        />
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}