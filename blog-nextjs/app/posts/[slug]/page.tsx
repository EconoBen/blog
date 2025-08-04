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
    <article className="post-detail">
      <header className="post-header">
        <div className="breadcrumb">
          <Link href="/posts">← Back to all posts</Link>
        </div>
        
        <h1 className="post-title">{post.title}</h1>
        
        <div className="post-meta">
          <time className="post-date">{formatDate(post.date)}</time>
          <span className="post-separator">•</span>
          <span className="post-reading-time">{post.readingTime || 5} min read</span>
        </div>

        <div className="post-tags">
          {post.tags.map(tag => (
            <Link key={tag} href={`/tags/${tag}`} className="post-tag">
              {tag}
            </Link>
          ))}
        </div>
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="post-cover-image">
          <img src={post.coverImage} alt={post.title} />
        </div>
      )}

      {/* Audio Player - only show if audio file exists */}
      {audioUrl && (
        <div className="post-audio-section">
          <AudioPlayer 
            audioUrl={audioUrl}
            title="Listen to this post"
            className="post-audio-player"
          />
        </div>
      )}

      {/* Post Content */}
      <div className="post-content">
        <MarkdownRenderer content={post.content} />
      </div>

      {/* Post Footer */}
      <footer className="post-footer">
        <div className="post-footer-tags">
          <h3>Tagged with:</h3>
          <div className="post-tags">
            {post.tags.map(tag => (
              <Link key={tag} href={`/tags/${tag}`} className="post-tag">
                {tag}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="post-navigation">
          <Link href="/posts" className="back-to-posts">
            ← View all posts
          </Link>
        </div>
      </footer>
    </article>
  );
}