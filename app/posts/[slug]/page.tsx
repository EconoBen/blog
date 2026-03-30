import type { Metadata } from 'next';
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

type Post = Awaited<ReturnType<typeof postService.getAllPosts>>[number];

const createDescription = (post: Post) => {
  const content = post.summary || post.content.replace(/\s+/g, ' ').trim();
  return content.slice(0, 180);
};

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
      title: 'Post Not Found | ECONOBEN.DEV',
    };
  }

  const imageUrl = post.coverImage?.startsWith('http')
    ? post.coverImage
    : post.coverImage
      ? `https://econoben.dev${post.coverImage}`
      : undefined;
  const description = createDescription(post);

  return {
    title: `${post.title} | Posts | ECONOBEN.DEV`,
    description,
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url: `https://econoben.dev/posts/${slug}`,
      images: imageUrl ? [imageUrl] : undefined,
      siteName: 'ECONOBEN.DEV',
      publishedTime: post.date.toISOString(),
      authors: ['Benjamin Labaschin'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await postService.getPostBySlug(slug);
  const allPosts = await postService.getAllPosts();

  if (!post) {
    notFound();
  }

  const primaryTag = post.tags[0];
  const audioUrl = audioManifest[slug as keyof typeof audioManifest];
  const archiveMonth = post.date.toISOString().slice(0, 7);
  const currentIndex = allPosts.findIndex((item) => item.slug === post.slug);
  const newerPost = currentIndex > 0 ? allPosts[currentIndex - 1] : undefined;
  const olderPost = currentIndex >= 0 ? allPosts[currentIndex + 1] : undefined;

  return (
    <EditorialPageFrame currentPath="/posts">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">{primaryTag ?? 'Post'}</p>
          <h1 className="editorial-page-title">{post.title}</h1>
          {post.summary && <p className="editorial-page-copy">{post.summary}</p>}
          <div className="editorial-post-meta">
            <span>Published {longDateFormatter.format(post.date)}</span>
            <span>{post.readingTime ? `${post.readingTime} min read` : 'Long-form post'}</span>
            <span>Filed in {monthYearFormatter.format(post.date)}</span>
          </div>
          <div className="editorial-home-actions">
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

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Article</p>
          <h2 className="editorial-page-section-title">Markdown, links, code blocks, and embedded media stay intact in the reading view.</h2>
        </div>

        <div className="blog-content">
          <MarkdownRenderer content={post.content} />
        </div>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Reading frame</p>
          <h2 className="editorial-page-section-title">Audio, tags, and the cover image stay available after the article begins.</h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-6 md:p-8">
            <div className="flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
              <span>Published {longDateFormatter.format(post.date)}</span>
              <span>{post.readingTime ? `${post.readingTime} min read` : 'Essay'}</span>
              <span>{post.tags.length} topic{post.tags.length === 1 ? '' : 's'}</span>
            </div>
            <div className="mt-6">
              {audioUrl ? (
                <AudioPlayer
                  audioUrl={audioUrl}
                  title="Listen to this post"
                  className="post-audio-player"
                />
              ) : (
                <p className="editorial-post-summary">No audio version is available for this post yet.</p>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.length > 0
                ? post.tags.map((tag) => (
                    <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                      {tag}
                    </Link>
                  ))
                : <span className="editorial-chip">Essay</span>}
            </div>
          </div>

          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="blog-image"
            />
          ) : null}
        </div>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Related reading</p>
          <h2 className="editorial-page-section-title">Move to the adjacent posts in the archive.</h2>
        </div>
        <div className="editorial-two-column">
          {newerPost ? (
            <article className="editorial-home-card">
              <p className="editorial-home-card-label">Newer post</p>
              <h3>
                <Link href={`/posts/${newerPost.slug}`}>{newerPost.title}</Link>
              </h3>
              {newerPost.summary && <p>{newerPost.summary}</p>}
              <div className="editorial-post-meta">
                <span>{longDateFormatter.format(newerPost.date)}</span>
                <span>{newerPost.readingTime ? `${newerPost.readingTime} min read` : 'Long-form post'}</span>
              </div>
              <Link href={`/posts/${newerPost.slug}`} className="editorial-home-card-link">
                Read newer post
              </Link>
            </article>
          ) : null}

          {olderPost ? (
            <article className="editorial-home-card">
              <p className="editorial-home-card-label">Older post</p>
              <h3>
                <Link href={`/posts/${olderPost.slug}`}>{olderPost.title}</Link>
              </h3>
              {olderPost.summary && <p>{olderPost.summary}</p>}
              <div className="editorial-post-meta">
                <span>{longDateFormatter.format(olderPost.date)}</span>
                <span>{olderPost.readingTime ? `${olderPost.readingTime} min read` : 'Long-form post'}</span>
              </div>
              <Link href={`/posts/${olderPost.slug}`} className="editorial-home-card-link">
                Read older post
              </Link>
            </article>
          ) : null}
        </div>
      </section>
    </EditorialPageFrame>
  );
}
