import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { EditorialPageFrame } from '../../components/EditorialPageFrame';
import { postService } from '../../services/PostService';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import AudioPlayer from '../../components/AudioPlayer';
import audioManifest from '../../config/audioManifest.json';

const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const monthYearFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
});

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
      title: 'Post Not Found | Ben Labaschin',
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
  const description = post.summary || post.content.replace(/\s+/g, ' ').slice(0, 160);

  return {
    title: `${post.title} | Ben Labaschin`,
    description,
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url: `https://econoben.dev/posts/${slug}`,
      images: [imageUrl],
      siteName: 'Ben Labaschin',
      publishedTime: post.date.toISOString(),
      authors: ['Benjamin Labaschin'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
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

  const primaryTag = post.tags[0];
  const audioUrl = audioManifest[slug as keyof typeof audioManifest];
  const archiveMonth = post.date.toISOString().slice(0, 7);

  return (
    <EditorialPageFrame currentPath="/posts">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy" style={{ maxWidth: '46rem' }}>
          <p className="editorial-home-kicker">{primaryTag ?? 'Post'}</p>
          <h1 className="editorial-page-title">{post.title}</h1>
          {post.summary && <p className="editorial-page-copy">{post.summary}</p>}
          <div className="editorial-post-meta" style={{ marginTop: '1rem' }}>
            <span>{longDateFormatter.format(post.date)}</span>
            <span>{post.readingTime ? `${post.readingTime} min read` : 'Post'}</span>
            <span>{monthYearFormatter.format(post.date)}</span>
          </div>
          <div className="editorial-chip-row">
            {post.tags.length > 0
              ? post.tags.map((tag) => (
                  <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                    {tag}
                  </Link>
                ))
              : <span className="editorial-chip">Post</span>}
          </div>
          <div className="editorial-home-actions" style={{ marginTop: '1rem' }}>
            <Link href="/posts" className="editorial-home-button editorial-home-button-secondary">
              Back to posts
            </Link>
            {primaryTag ? (
              <Link href={`/tags/${encodeURIComponent(primaryTag)}`} className="editorial-home-button editorial-home-button-primary">
                Browse this topic
              </Link>
            ) : null}
            <Link href={`/archives/${archiveMonth}`} className="editorial-home-button editorial-home-button-secondary">
              Browse this month
            </Link>
          </div>
        </div>
      </section>

      <section className="editorial-list-section" style={{ maxWidth: '46rem', marginInline: 'auto' }}>
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
      </section>
    </EditorialPageFrame>
  );
}
