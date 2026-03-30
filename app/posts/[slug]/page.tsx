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

const getRelatedPosts = async (currentSlug: string, currentTags: string[]) => {
  const allPosts = await postService.getAllPosts();

  return allPosts
    .filter((candidate) => candidate.slug !== currentSlug)
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) => currentTags.includes(tag));
      return {
        post: candidate,
        sharedTags,
      };
    })
    .filter(({ sharedTags }) => sharedTags.length > 0)
    .sort((a, b) => {
      if (b.sharedTags.length !== a.sharedTags.length) {
        return b.sharedTags.length - a.sharedTags.length;
      }

      return b.post.date.getTime() - a.post.date.getTime();
    })
    .slice(0, 3);
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
  const relatedPosts = await getRelatedPosts(slug, post.tags);
  const articleMonth = monthYearFormatter.format(post.date);

  return (
    <EditorialPageFrame currentPath="/posts">
      <section className="editorial-page-hero" style={{ marginBottom: '18px' }}>
        <div className="editorial-page-hero-copy" style={{ maxWidth: '44rem' }}>
          <div className="editorial-breadcrumb" aria-label="Post breadcrumb">
            <Link href="/posts">Posts</Link>
            <span>/</span>
            {primaryTag ? (
              <>
                <Link href={`/tags/${encodeURIComponent(primaryTag)}`}>{primaryTag}</Link>
                <span>/</span>
              </>
            ) : null}
            <span>{post.title}</span>
          </div>
          <p className="editorial-home-kicker">{primaryTag ?? 'Post'}</p>
          <h1 className="editorial-page-title">{post.title}</h1>
          {post.summary && <p className="editorial-page-copy">{post.summary}</p>}
          <div className="editorial-post-meta-panel" style={{ marginTop: '18px' }}>
            <span>{longDateFormatter.format(post.date)}</span>
            <span>{post.readingTime ? `${post.readingTime} min read` : 'Post'}</span>
            <span>{articleMonth}</span>
            {primaryTag ? <Link href={`/tags/${encodeURIComponent(primaryTag)}`}>{primaryTag}</Link> : null}
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
          <div className="editorial-link-row">
            <Link href="/posts" className="editorial-post-link">
              Back to posts
            </Link>
            {primaryTag ? (
              <Link href={`/tags/${encodeURIComponent(primaryTag)}`} className="editorial-post-link">
                Browse this topic
              </Link>
            ) : null}
            <Link href={`/archives/${archiveMonth}`} className="editorial-post-link">
              Browse this month
            </Link>
          </div>
        </div>
        <aside className="editorial-page-aside">
          <p className="editorial-home-card-label">Reading notes</p>
          <h3 style={{ marginTop: '8px' }}>{articleMonth}</h3>
          <p>{longDateFormatter.format(post.date)}</p>
          <div className="editorial-page-metric-list" style={{ marginTop: '16px' }}>
            <div>
              <span className="editorial-page-metric-value">{post.readingTime ? `${post.readingTime} min` : 'Post'}</span>
              <span className="editorial-page-metric-label">Reading time</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">{post.tags.length}</span>
              <span className="editorial-page-metric-label">Tags attached to this post</span>
            </div>
          </div>
          <div className="editorial-chip-row">
            <Link href="/archive" className="editorial-chip">
              Archive
            </Link>
            {primaryTag ? (
              <Link href={`/tags/${encodeURIComponent(primaryTag)}`} className="editorial-chip">
                {primaryTag}
              </Link>
            ) : null}
          </div>
        </aside>
      </section>

      <section className="editorial-list-section editorial-post-surface" style={{ marginInline: 'auto' }}>
        {audioUrl && (
          <AudioPlayer
            audioUrl={audioUrl}
            title="Listen to this post"
            className="post-audio-player"
          />
        )}

        <div className="editorial-post-meta-panel">
          <span>{longDateFormatter.format(post.date)}</span>
          <span>{monthYearFormatter.format(post.date)}</span>
          <span>{post.readingTime ? `${post.readingTime} min read` : 'Post'}</span>
          <span>{post.tags.length} tag{post.tags.length === 1 ? '' : 's'}</span>
        </div>

        <div className="blog-content">
          <MarkdownRenderer content={post.content} />
        </div>

        <section className="editorial-author-box">
          <div className="editorial-author-avatar" aria-hidden="true">
            BL
          </div>
          <div>
            <p className="editorial-home-card-label">Author box</p>
            <h3 style={{ marginTop: '8px' }}>Benjamin Labaschin</h3>
            <p>
              Independent writer and engineer covering AI systems, memory, engineering practice, and the occasional economics detour.
            </p>
            <div className="editorial-link-row">
              <Link href="/about" className="editorial-post-link">
                About
              </Link>
              <Link href="/posts" className="editorial-post-link">
                Posts
              </Link>
              <Link href="/search" className="editorial-post-link">
                Search
              </Link>
            </div>
          </div>
        </section>

        <section className="editorial-analysis-card">
          <p className="editorial-home-card-label">Related analysis</p>
          <h3>More reading connected to this post.</h3>
          <p>
            The archive is grouped by shared tags and recency so you can continue along the same thread without losing the original slug or markdown content.
          </p>
          <div className="editorial-analysis-grid" style={{ marginTop: '16px' }}>
            {relatedPosts.length > 0 ? (
              relatedPosts.map(({ post: relatedPost, sharedTags }) => (
                <article key={relatedPost.slug} className="editorial-search-sidebar-card">
                  <p className="editorial-home-card-label">{longDateFormatter.format(relatedPost.date)}</p>
                  <h3 style={{ marginTop: '8px' }}>
                    <Link href={`/posts/${relatedPost.slug}`}>{relatedPost.title}</Link>
                  </h3>
                  {relatedPost.summary && <p>{relatedPost.summary}</p>}
                  <div className="editorial-chip-row">
                    {sharedTags.slice(0, 3).map((tag) => (
                      <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                        {tag}
                      </Link>
                    ))}
                  </div>
                </article>
              ))
            ) : (
              <article className="editorial-search-sidebar-card">
                <p className="editorial-home-card-label">No direct match</p>
                <h3 style={{ marginTop: '8px' }}>Use the topic index to keep reading.</h3>
                <p>This post does not share a tag with another item in the archive, so the best next step is to browse the broader topic index.</p>
                <div className="editorial-link-row">
                  <Link href="/tags" className="editorial-post-link">
                    Topics
                  </Link>
                  <Link href="/archive" className="editorial-post-link">
                    Archive
                  </Link>
                </div>
              </article>
            )}
          </div>
        </section>
      </section>
    </EditorialPageFrame>
  );
}
