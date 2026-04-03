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
    <section className="mx-auto max-w-7xl px-8 py-24 md:py-32">
      <div className="max-w-3xl">
        <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-[#004ac6]">
          Technical editorial
        </p>
        <h1 className="mt-6 font-headline text-5xl font-black tracking-tighter text-[#1d1c16] md:text-7xl">
          Writing about how AI systems remember, fail, and scale.
        </h1>
        <p className="mt-6 max-w-2xl text-2xl leading-relaxed text-[#555f70] md:text-3xl">
          The archive is loading, but the rest of the site is already live: posts, talks, publications, and the forthcoming book on Agent Memory.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/book"
            className="rounded-lg bg-[#004ac6] px-8 py-4 font-headline text-sm font-bold uppercase tracking-wider text-white shadow-[0_14px_28px_rgba(0,74,198,0.18)] transition-transform hover:-translate-y-1 hover:bg-[#003ea8]"
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
      <section className="mx-auto max-w-7xl px-8 pb-20 pt-14 md:pb-24 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="inline-block rounded-sm bg-[#dce5ff] px-2 py-1 font-label text-xs font-bold uppercase tracking-[0.2em] text-[#1d1c16]">
              Technical editorial
            </p>
            <h1 className="mt-6 max-w-4xl font-headline text-5xl font-black tracking-tighter text-[#1d1c16] md:text-7xl lg:text-8xl">
              Writing about how AI systems <span className="font-body italic font-normal text-[#004ac6]">remember</span>, fail, and scale
            </h1>
            <p className="mt-6 max-w-2xl text-2xl leading-relaxed text-[#555f70] md:text-3xl">
              A public platform for posts, talks, publications, and the forthcoming book on Agent Memory
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/book"
                className="rounded-lg bg-[#004ac6] px-8 py-4 font-headline text-sm font-bold uppercase tracking-wider text-white shadow-[0_14px_28px_rgba(0,74,198,0.18)] transition-transform hover:-translate-y-1 hover:bg-[#003ea8]"
                style={{ color: '#fef9ef', WebkitTextFillColor: '#fef9ef' }}
              >
                Follow the book
              </Link>
              <Link href="/posts" className="rounded-lg bg-[#ede8de] px-8 py-4 font-headline text-sm font-bold uppercase tracking-wider text-[#1d1c16] transition-transform hover:-translate-y-1">
                Browse selected writing
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              {topTags.map(([tag, count]) => (
                <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#1d1c16] transition-colors hover:text-[#004ac6]">
                  {tag} ({count})
                </Link>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-5">
            <article className="overflow-hidden rounded-3xl border border-[#1d1c16]/8 bg-[#f8f3e9] text-[#1d1c16] shadow-[0_24px_70px_rgba(16,34,54,0.12)]">
              <div className="relative h-72 overflow-hidden">
                {imageSourceFor(featuredPost) ? (
                  <img
                    src={imageSourceFor(featuredPost) as string}
                    alt={featuredPost.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-end bg-[linear-gradient(135deg,#dfe6fb_0%,#f5efe2_100%)] p-8">
                    <div>
                      <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#555f70]">
                        Latest writing
                      </p>
                      <p className="mt-3 max-w-sm font-headline text-3xl font-black leading-none text-[#1d1c16]">
                        {featuredPost.title}
                      </p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,243,233,0)_34%,rgba(248,243,233,0.3)_64%,rgba(248,243,233,0.92)_100%)]" />
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#555f70]">
                  <span className="rounded-sm bg-[#fef9ef]/92 px-3 py-1 font-label font-bold text-[#1d1c16] shadow-[0_8px_20px_rgba(16,34,54,0.1)]">
                    Latest post
                  </span>
                  <span className="font-label font-bold">{dateFormatter.format(featuredPost.date)}</span>
                </div>
              </div>
              <div className="p-8">
                <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#555f70]">
                  {primaryTag(featuredPost)}
                </p>
                <h2 className="mt-4 font-headline text-3xl font-bold leading-tight text-[#1d1c16] md:text-4xl">
                  <Link href={`/posts/${featuredPost.slug}`} className="transition-colors hover:text-[#004ac6]">
                    {featuredPost.title}
                  </Link>
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-[#555f70]">
                  {excerptFor(featuredPost)}
                </p>
                <div className="mt-8 flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.22em] text-[#555f70]">
                  <span>{featuredPost.readingTime ? `${featuredPost.readingTime} min read` : 'Read now'}</span>
                  <span>{dateFormatter.format(featuredPost.date)}</span>
                  <span>{featuredPost.tags.length ? `${featuredPost.tags.length} tags` : 'Editorial post'}</span>
                </div>
                <div className="mt-8">
                  <Link href={`/posts/${featuredPost.slug}`} className="inline-flex items-center gap-2 font-label text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#004ac6] transition-transform hover:translate-x-1">
                    Read the post
                  </Link>
                </div>
              </div>
            </article>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8">
        <div className="flex flex-wrap items-center gap-4 border-y border-[#c3c6d7]/40 py-5 font-label text-xs font-bold uppercase tracking-[0.22em] text-[#555f70]">
          <span>{posts.length} published posts</span>
          <span className="hidden sm:inline">/</span>
          <span>{uniqueTags} unique topics</span>
          <span className="hidden sm:inline">/</span>
          <span>{yearsRepresented} years represented</span>
          <span className="hidden sm:inline">/</span>
          <span>{postsWithImages} posts with images</span>
        </div>
      </section>

      <section className="border-t border-[#d0d3db] py-16 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-8">
          <div className="mb-10 flex flex-wrap items-baseline gap-4 sm:mb-12">
            <p className="inline-block rounded-sm bg-[#dce5ff] px-2 py-1 font-label text-xs font-bold uppercase tracking-[0.2em] text-[#1d1c16]">
              Selected work
            </p>
            <h2 className="font-headline text-2xl font-bold tracking-tight text-[#1d1c16] md:text-3xl">
              Recent writing and where to go next
            </h2>
            <Link href="/archive" className="ml-auto border-b-2 border-[#004ac6] pb-1 font-label text-sm font-bold uppercase tracking-[0.2em] text-[#004ac6]">
              View archive
            </Link>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[leadDiscoveryPost, ...supportingPosts, secondaryPost].filter(Boolean).map((post) => (
              <article key={(post as Post).slug} className="group overflow-hidden rounded-2xl border border-[#1d1c16] bg-white/60 backdrop-blur-sm p-8 transition-transform duration-300 hover:-translate-y-1">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#004ac6]">
                      {primaryTag(post as Post)}
                    </p>
                    <h3 className="font-headline text-2xl font-bold leading-snug text-[#1d1c16] transition-colors group-hover:text-[#004ac6]">
                      <Link href={`/posts/${(post as Post).slug}`}>
                        {(post as Post).title}
                      </Link>
                    </h3>
                  </div>
                  <time className="block font-label text-[10px] uppercase tracking-widest text-[#555f70]">{dateFormatter.format((post as Post).date)}</time>
                  <p className="text-base leading-relaxed text-[#555f70]">
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
                    <Link href={`/posts/${(post as Post).slug}`} className="inline-flex items-center justify-center rounded-lg border border-[#c0c4cc] bg-transparent px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-[#1d1c16] transition-colors hover:bg-[#1d1c16] hover:text-white">
                      Read the post
                    </Link>
                  </div>
                </div>
              </article>
            ))}

            <article className="group overflow-hidden rounded-2xl border border-[#1d1c16] bg-white/60 backdrop-blur-sm p-8 transition-transform duration-300 hover:-translate-y-1">
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#004ac6]">
                    Upcoming publication
                  </p>
                  <h3 className="font-headline text-2xl font-bold leading-snug text-[#1d1c16] transition-colors group-hover:text-[#004ac6]">
                    <Link href="/book">
                      Agent Memory
                    </Link>
                  </h3>
                </div>
                <p className="text-base leading-relaxed text-[#555f70]">
                  A practical guide to how AI systems remember, retrieve, compress, and act on information in production. The book extends the same technical arc as the posts and talks.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#c0c4cc] bg-transparent px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-[#1d1c16]">AI Memory</span>
                  <span className="rounded-full border border-[#c0c4cc] bg-transparent px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-[#1d1c16]">Production Systems</span>
                  <span className="rounded-full border border-[#c0c4cc] bg-transparent px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-[#1d1c16]">Book</span>
                </div>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link href="/book" className="inline-flex items-center justify-center rounded-lg border border-[#c0c4cc] bg-transparent px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-[#1d1c16] transition-colors hover:bg-[#1d1c16] hover:text-white">
                    Follow the book
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl border-t border-[#d0d3db] px-8 pt-16 pb-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="inline-block rounded-sm bg-[#dce5ff] px-2 py-1 font-label text-xs font-bold uppercase tracking-[0.2em] text-[#1d1c16]">
              Direct updates
            </p>
            <h2 className="mt-4 max-w-2xl font-headline text-5xl font-black tracking-tighter text-[#1d1c16] md:text-6xl">
              Email updates
            </h2>
            <p className="mt-6 max-w-2xl text-2xl leading-relaxed text-[#555f70]">
              No fake signup funnel here. If you want updates on the book, new posts, talks, or publications, the simplest path is still direct email.
            </p>
          </div>

          <div className="rounded-3xl border border-[#e4e7ef]/50 bg-[linear-gradient(135deg,#ffffff_0%,#f7f8ff_35%,#ffffff_55%,#f8f9fe_80%,#ffffff_100%)] p-8 shadow-[0_24px_70px_rgba(16,34,54,0.06)] lg:col-span-5">
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#555f70]">
              Direct contact
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[#1d1c16]">
              Email if you want updates on Agent Memory or want to talk about the posts, talks, or publications. This section should stay practical, not newsletter-branded.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="mailto:benjaminlabaschindev@gmail.com?subject=Agent%20Memory%20updates"
                className="rounded-lg bg-[#004ac6] px-6 py-3 font-label text-xs font-bold uppercase tracking-[0.22em] text-white shadow-[0_12px_24px_rgba(0,74,198,0.14)] transition-transform hover:-translate-y-1 hover:bg-[#003ea8]"
                style={{ color: '#fef9ef', WebkitTextFillColor: '#fef9ef' }}
              >
                Email updates
              </a>
            </div>
          </div>
        </div>
      </section>
    </EditorialPageFrame>
  );
}
