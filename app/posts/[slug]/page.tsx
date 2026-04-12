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
      {/* ── Hero ── */}
      <section className="mx-auto max-w-[1440px] px-8 pb-8 pt-14 md:pb-12 md:pt-20">
        <div className="max-w-3xl">
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#0035a0]">
            {primaryTag ?? 'Post'}
          </p>
          <h1 className="mt-4 font-headline text-4xl font-black tracking-tight text-[#1d1c16] md:text-5xl">
            {post.title}
          </h1>
          {post.summary && (
            <p className="mt-4 max-w-2xl font-body text-lg leading-relaxed text-[#555f70]">
              {post.summary}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-4 font-label text-[10px] uppercase tracking-widest text-[#555f70]">
            <span>Published {longDateFormatter.format(post.date)}</span>
            <span>{post.readingTime ? `${post.readingTime} min read` : 'Long-form post'}</span>
            <span>Filed in {monthYearFormatter.format(post.date)}</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/posts" className="rounded-lg border border-[#c0c4cc] bg-transparent px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-[#1d1c16] transition-transform hover:-translate-y-1">
              Back to posts
            </Link>
            {primaryTag && (
              <Link href={`/tags/${encodeURIComponent(primaryTag)}`} className="rounded-lg bg-[#0035a0] px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-white transition-transform hover:-translate-y-1" style={{ color: '#fff', WebkitTextFillColor: '#fff' }}>
                Browse this topic
              </Link>
            )}
            <Link href={`/archives/${archiveMonth}`} className="rounded-lg border border-[#c0c4cc] bg-transparent px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-[#1d1c16] transition-transform hover:-translate-y-1">
              Browse this month
            </Link>
          </div>
        </div>
      </section>

      {/* ── Cover image ── */}
      {post.coverImage && (
        <div className="mx-auto max-w-[1440px] px-8">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full rounded-2xl object-cover"
            style={{ maxHeight: '480px' }}
          />
        </div>
      )}

      {/* ── Article body ── */}
      <section className="border-t border-outline-variant/20 mt-8">
        <div className="mx-auto max-w-[860px] px-8 py-12 md:py-16">
          <div className="blog-content prose-lg">
            <MarkdownRenderer content={post.coverImage ? post.content.replace(new RegExp(`!\\[[^\\]]*\\]\\(${post.coverImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'm'), '') : post.content} />
          </div>
        </div>
      </section>

      {/* ── Audio + Tags sidebar ── */}
      <section className="border-t border-outline-variant/20">
        <div className="mx-auto max-w-[1440px] px-8 py-12 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="sticky-note p-6 md:p-8">
              <div className="flex flex-wrap gap-3 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#555f70]">
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
                  <p className="font-body text-sm text-[#555f70]">No audio version is available for this post yet.</p>
                )}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {post.tags.length > 0
                  ? post.tags.map((tag) => (
                      <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="rounded-full border border-[#c0c4cc] bg-transparent px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-[#1d1c16] transition-colors hover:bg-[#ede8de]">
                        {tag}
                      </Link>
                    ))
                  : <span className="rounded-full border border-[#c0c4cc] bg-transparent px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-[#1d1c16]">Essay</span>}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Related reading ── */}
      {(newerPost || olderPost) && (
        <section className="border-t border-outline-variant/20">
          <div className="mx-auto max-w-[1440px] px-8 py-12 md:py-16">
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#0035a0]">Related reading</p>
            <h2 className="mt-3 font-headline text-3xl font-bold tracking-tight text-[#1d1c16]">
              Move to the adjacent posts in the archive.
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {newerPost && (
                <article className="sticky-note p-6 md:p-8 transition-transform duration-300 hover:-translate-y-1">
                  <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#0035a0]">Newer post</p>
                  <h3 className="mt-3 font-headline text-xl font-bold leading-snug text-[#1d1c16] md:text-2xl">
                    <Link href={`/posts/${newerPost.slug}`} className="transition-colors hover:text-[#0035a0]">
                      {newerPost.title}
                    </Link>
                  </h3>
                  {newerPost.summary && (
                    <p className="mt-3 font-body text-base leading-relaxed text-[#555f70]">{newerPost.summary}</p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-3 font-label text-[10px] uppercase tracking-widest text-[#555f70]">
                    <span>{longDateFormatter.format(newerPost.date)}</span>
                    <span>{newerPost.readingTime ? `${newerPost.readingTime} min read` : 'Long-form post'}</span>
                  </div>
                  <div className="mt-4">
                    <Link href={`/posts/${newerPost.slug}`} className="font-label text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#0035a0] transition-transform hover:translate-x-1">
                      Read newer post →
                    </Link>
                  </div>
                </article>
              )}

              {olderPost && (
                <article className="sticky-note p-6 md:p-8 transition-transform duration-300 hover:-translate-y-1">
                  <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#0035a0]">Older post</p>
                  <h3 className="mt-3 font-headline text-xl font-bold leading-snug text-[#1d1c16] md:text-2xl">
                    <Link href={`/posts/${olderPost.slug}`} className="transition-colors hover:text-[#0035a0]">
                      {olderPost.title}
                    </Link>
                  </h3>
                  {olderPost.summary && (
                    <p className="mt-3 font-body text-base leading-relaxed text-[#555f70]">{olderPost.summary}</p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-3 font-label text-[10px] uppercase tracking-widest text-[#555f70]">
                    <span>{longDateFormatter.format(olderPost.date)}</span>
                    <span>{olderPost.readingTime ? `${olderPost.readingTime} min read` : 'Long-form post'}</span>
                  </div>
                  <div className="mt-4">
                    <Link href={`/posts/${olderPost.slug}`} className="font-label text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#0035a0] transition-transform hover:translate-x-1">
                      Read older post →
                    </Link>
                  </div>
                </article>
              )}
            </div>
          </div>
        </section>
      )}
    </EditorialPageFrame>
  );
}
