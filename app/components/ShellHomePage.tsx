import Link from 'next/link';
import { EditorialPageFrame } from './EditorialPageFrame';
import type { Post } from '../services/PostService';

interface ShellHomePageProps {
  posts: Post[];
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const excerptFor = (post: Post, maxLength = 180) => {
  const source = post.summary?.trim() || post.content.split('\n\n')[0]?.trim() || '';

  if (source.length <= maxLength) {
    return source;
  }

  return `${source.slice(0, maxLength - 1).trimEnd()}…`;
};

const primaryTag = (post: Post) => post.tags[0] ?? 'Editorial';

const imageSourceFor = (post: Post) => post.coverImage || post.image || null;

const topTagsFor = (posts: Post[], limit = 4) => {
  const counts = new Map<string, number>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
};

const ShellHomeEmptyState = () => (
  <EditorialPageFrame currentPath="/" pageClassName="shell-home-page">
    <section className="mx-auto max-w-[1440px] px-8 py-24 md:py-32">
      <div className="max-w-3xl">
        <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-[#0035a0]">
          Technical editorial
        </p>
        <h1 className="mt-6 font-headline text-4xl font-black tracking-tight text-on-surface md:text-5xl">
          Writing about how AI systems remember, fail, and scale.
        </h1>
        <p className="mt-6 max-w-2xl text-2xl leading-relaxed text-[#1d1c16] md:text-3xl">
          The archive is loading, but the rest of the site is already live: posts, talks, publications, and the forthcoming book on Agent Memory.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/book"
            className="rounded-lg bg-[#0035a0] px-8 py-4 font-headline text-sm font-bold uppercase tracking-wider text-white shadow-[0_14px_28px_rgba(0,74,198,0.18)] transition-transform hover:-translate-y-1 hover:bg-[#003ea8]"
            style={{ color: '#fef9ef', WebkitTextFillColor: '#fef9ef' }}
          >
            Follow the book
          </Link>
          <Link href="/about" className="rounded-lg bg-[#ede8de] px-8 py-4 font-headline text-sm font-bold uppercase tracking-wider text-[#1d1c16] transition-transform hover:-translate-y-1">
            About / CV
          </Link>
        </div>
      </div>
    </section>
  </EditorialPageFrame>
);

export function ShellHomePage({ posts }: ShellHomePageProps) {
  if (!posts.length) {
    return <ShellHomeEmptyState />;
  }

  const [featuredPost, ...restPosts] = posts;
  const discoveryPosts = restPosts.slice(0, 4);
  const leadDiscoveryPost = discoveryPosts[0] ?? featuredPost;
  const supportingPosts = discoveryPosts.slice(1, 3);
  const secondaryPost = discoveryPosts[3] ?? null;
  const topTags = topTagsFor(posts);
  const uniqueTags = new Set(posts.flatMap((post) => post.tags)).size;
  const yearsRepresented = new Set(posts.map((post) => post.date.getFullYear())).size;
  const postsWithImages = posts.filter((post) => Boolean(imageSourceFor(post))).length;

  return (
    <EditorialPageFrame currentPath="/" pageClassName="shell-home-page">
      {/* ── Featured banner — distinct from rest of page ── */}
      <section className="banner-glow bg-[#e8eef8]">
        <div className="mx-auto max-w-[1440px] px-8 py-14 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* Left: headline centered vertically */}
            <div className="space-y-6">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#0035a0]">
                Technical editorial
              </p>
              <h1 className="max-w-xl font-headline text-4xl font-black tracking-tight text-[#1d1c16] md:text-5xl">
                Writing about how AI systems <span className="font-body italic font-normal text-[#0035a0]">remember</span>, fail, and scale
              </h1>
              <Link href="/posts" className="inline-flex rounded-lg border border-[#c0c4cc] bg-white/60 px-6 py-3 font-headline text-sm font-bold uppercase tracking-wider text-[#1d1c16] transition-transform hover:-translate-y-1">
                Browse writing
              </Link>
            </div>

            {/* Right: featured post card */}
            <article className="featured-shimmer overflow-hidden rounded-2xl border border-white/15 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
              <div className="space-y-4 p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-t-lg rounded-b-none bg-[#0035a0] px-3 py-1.5 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                    Latest post
                  </span>
                  <span className="font-label text-[10px] uppercase tracking-widest text-[#555f70]">{dateFormatter.format(featuredPost.date)}</span>
                </div>
                <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#0035a0]">
                  {primaryTag(featuredPost)}
                </p>
                <h2 className="font-headline text-2xl font-bold leading-snug text-[#1d1c16] md:text-3xl">
                  <Link href={`/posts/${featuredPost.slug}`} className="transition-colors hover:text-[#0035a0]">
                    {featuredPost.title}
                  </Link>
                </h2>
                <p className="line-clamp-3 text-base leading-relaxed text-[#555f70]">
                  {excerptFor(featuredPost)}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.22em] text-[#555f70]">
                  <span>{featuredPost.readingTime ? `${featuredPost.readingTime} min read` : 'Read now'}</span>
                  <span>{featuredPost.tags.length} tags</span>
                </div>
                <Link href={`/posts/${featuredPost.slug}`} className="inline-flex items-center justify-center rounded-lg border border-[#c0c4cc] bg-transparent px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-[#1d1c16] transition-transform hover:-translate-y-1">
                  Read the post
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="border-t border-[#d0d3db] py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-[1440px] px-8">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 sm:mb-12">
            <p className="inline-block rounded-sm bg-[#dce5ff] px-2 py-1 font-label text-xs font-bold uppercase tracking-[0.2em] text-[#1d1c16]">
              Selected work
            </p>
            <Link href="/archive" className="border-b border-[#1d1c16] pb-0.5 font-label text-xs font-bold uppercase tracking-[0.2em] text-[#1d1c16]">
              View archive
            </Link>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[leadDiscoveryPost, ...supportingPosts, secondaryPost].filter(Boolean).map((post) => (
              <article key={(post as Post).slug} className="group sticky-note overflow-hidden p-8 transition-transform duration-300 hover:-translate-y-1">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#1d1c16]">
                      {primaryTag(post as Post)}
                    </p>
                    <h3 className="font-headline text-2xl font-bold leading-snug text-[#1d1c16] transition-colors group-hover:text-[#0035a0]">
                      <Link href={`/posts/${(post as Post).slug}`}>
                        {(post as Post).title}
                      </Link>
                    </h3>
                  </div>
                  <time className="block font-label text-[10px] uppercase tracking-widest text-[#1d1c16]">{dateFormatter.format((post as Post).date)}</time>
                  <p className="text-base leading-relaxed text-[#1d1c16]">
                    {excerptFor(post as Post, 140)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(post as Post).tags.slice(0, 3).map((tag) => (
                      <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="rounded-full border border-[#c0c4cc] bg-transparent px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-[#1d1c16]">
                        {tag}
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <Link href={`/posts/${(post as Post).slug}`} className="inline-flex items-center justify-center rounded-lg border border-[#c0c4cc] bg-transparent px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-[#1d1c16] transition-transform hover:-translate-y-1">
                      Read the post
                    </Link>
                  </div>
                </div>
              </article>
            ))}

            <article className="group sticky-note overflow-hidden p-8 transition-transform duration-300 hover:-translate-y-1">
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#1d1c16]">
                    Upcoming publication
                  </p>
                  <h3 className="font-headline text-2xl font-bold leading-snug text-[#1d1c16] transition-colors group-hover:text-[#0035a0]">
                    <Link href="/book">
                      Agent Memory
                    </Link>
                  </h3>
                </div>
                <p className="text-base leading-relaxed text-[#1d1c16]">
                  A practical guide to how AI systems remember, retrieve, compress, and act on information in production. The book extends the same technical arc as the posts and talks.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#c0c4cc] bg-transparent px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-[#1d1c16]">AI Memory</span>
                  <span className="rounded-full border border-[#c0c4cc] bg-transparent px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-[#1d1c16]">Production Systems</span>
                  <span className="rounded-full border border-[#c0c4cc] bg-transparent px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-[#1d1c16]">Book</span>
                </div>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link href="/book" className="inline-flex items-center justify-center rounded-lg border border-[#c0c4cc] bg-transparent px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-[#1d1c16] transition-transform hover:-translate-y-1">
                    Follow the book
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="banner-glow bg-[#e8eef8] py-16 sm:py-20">
        <div className="mx-auto max-w-[1440px] px-8">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="space-y-4">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#0035a0]">
                Stay in the loop
              </p>
              <h2 className="font-headline text-3xl font-black tracking-tight text-[#1d1c16] md:text-4xl">
                Get updates on new posts, talks, and book progress
              </h2>
              <p className="max-w-lg text-lg leading-relaxed text-[#1d1c16]/70">
                No newsletter — just a direct email when something new ships
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 md:items-end">
              <a
                href="mailto:benjaminlabaschindev@gmail.com?subject=Agent%20Memory%20updates"
                className="inline-flex items-center justify-center rounded-lg border border-[#0035a0]/30 bg-white/80 px-8 py-4 font-headline text-sm font-bold uppercase tracking-wider text-[#0035a0] shadow-[0_8px_24px_rgba(0,53,160,0.08)] transition-transform hover:-translate-y-1"
              >
                Email for updates
              </a>
              <p className="font-label text-[10px] uppercase tracking-widest text-[#1d1c16]/40">
                benjaminlabaschindev@gmail.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </EditorialPageFrame>
  );
}
