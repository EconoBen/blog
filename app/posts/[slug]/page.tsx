import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { postService } from '../../services/PostService';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import AudioPlayer from '../../components/AudioPlayer';
import audioManifest from '../../config/audioManifest.json';

export async function generateStaticParams() {
  const posts = await postService.getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await postService.getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | Economic Notes',
    };
  }

  // Generate OG image URL
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
    description: post.summary,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.summary,
      url: `https://econoben.dev/posts/${slug}`,
      images: [imageUrl],
      siteName: 'Economic Notes',
      publishedTime: post.date.toISOString(),
      authors: ['Benjamin Labaschin'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: [imageUrl],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await postService.getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Check if audio exists for this post
  const audioUrl = audioManifest[slug as keyof typeof audioManifest];

  return (
    <div className="post-detail">
      <div className="blog-header">
        <h1 className="blog-title">{post.title}</h1>
        <div className="blog-meta">
          {formatDate(post.date)}
          {post.tags.map(tag => (
            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
              <span className="blog-tag">{tag}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Audio Player - only show if audio file exists */}
      {audioUrl && (
        <AudioPlayer
          audioUrl={audioUrl}
          title="Listen to this post"
          className="post-audio-player"
        />
      )}

      <div className="blog-content">
        <MarkdownRenderer content={post.content} />
      </div>
    </div>
  );
}