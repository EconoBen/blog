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
          <Link href="/book" className="rounded-lg bg-[#1d1c16] px-8 py-4 font-headline text-sm font-bold uppercase tracking-wider text-[#fef9ef] transition-transform hover:-translate-y-1">
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
  const supportingPosts = restPosts.slice(0, 2);
  const secondaryPost = restPosts[2] ?? null;
  const topTags = topTagsFor(posts);
  const uniqueTags = new Set(posts.flatMap((post) => post.tags)).size;
  const yearsRepresented = new Set(posts.map((post) => post.date.getFullYear())).size;
  const postsWithImages = posts.filter((post) => Boolean(imageSourceFor(post))).length;

  return (
    <EditorialPageFrame currentPath="/" pageClassName="shell-home-page">
      <section className="mx-auto max-w-7xl px-8 pb-20 pt-20 md:pb-24 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-[#004ac6]">
              Technical editorial
            </p>
            <h1 className="mt-6 max-w-4xl font-headline text-5xl font-black tracking-tighter text-[#1d1c16] md:text-7xl lg:text-8xl">
              Writing about how AI systems <span className="font-body italic font-normal text-[#004ac6]">remember</span>, fail, and scale.
            </h1>
            <p className="mt-6 max-w-2xl text-2xl leading-relaxed text-[#555f70] md:text-3xl">
              A public platform for posts, talks, publications, and the forthcoming book on Agent Memory.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/book" className="rounded-lg bg-[#1d1c16] px-8 py-4 font-headline text-sm font-bold uppercase tracking-wider text-[#fef9ef] transition-transform hover:-translate-y-1">
                Follow the book
              </Link>
              <Link href="/posts" className="rounded-lg bg-[#ede8de] px-8 py-4 font-headline text-sm font-bold uppercase tracking-wider text-[#1d1c16] transition-transform hover:-translate-y-1">
                Browse selected writing
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              {topTags.map(([tag, count]) => (
                <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="rounded-sm bg-[#ede8de] px-3 py-1 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#555f70] transition-colors hover:bg-[#e7e2d8]">
                  {tag} ({count})
                </Link>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-5">
            <article className="overflow-hidden rounded-3xl bg-[#1d1c16] text-[#fef9ef] shadow-[0_24px_70px_rgba(16,34,54,0.14)]">
              <div className="relative h-72 overflow-hidden">
                {imageSourceFor(featuredPost) ? (
                  <img
                    src={imageSourceFor(featuredPost) as string}
                    alt={featuredPost.title}
                    className="h-full w-full object-cover opacity-85"
                  />
                ) : (
                  <div className="flex h-full items-end bg-[linear-gradient(135deg,#1d1c16_0%,#32302a_100%)] p-8">
                    <div>
                      <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#bdc7db]">
                        Latest writing
                      </p>
                      <p className="mt-3 max-w-sm font-headline text-3xl font-black leading-none">
                        {featuredPost.title}
                      </p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(29,28,22,0)_35%,rgba(29,28,22,0.84)_100%)]" />
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#f5f0e6]">
                  <span className="rounded-sm bg-[#bdc7db]/20 px-3 py-1 font-label font-bold">
                    Latest post
                  </span>
                  <span className="font-label font-bold">{dateFormatter.format(featuredPost.date)}</span>
                </div>
              </div>
              <div className="p-8">
                <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#bdc7db]">
                  {primaryTag(featuredPost)}
                </p>
                <h2 className="mt-4 font-headline text-3xl font-bold leading-tight text-[#fef9ef] md:text-4xl">
                  <Link href={`/posts/${featuredPost.slug}`} className="transition-colors hover:text-[#b4c5ff]">
                    {featuredPost.title}
                  </Link>
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-[#e7e2d8]">
                  {excerptFor(featuredPost)}
                </p>
                <div className="mt-8 flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.22em] text-[#bdc7db]">
                  <span>{featuredPost.readingTime ? `${featuredPost.readingTime} min read` : 'Read now'}</span>
                  <span>{dateFormatter.format(featuredPost.date)}</span>
                  <span>{featuredPost.tags.length ? `${featuredPost.tags.length} tags` : 'Editorial post'}</span>
                </div>
                <div className="mt-8">
                  <Link href={`/posts/${featuredPost.slug}`} className="inline-flex items-center gap-2 font-label text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#b4c5ff] transition-transform hover:translate-x-1">
                    Read the post
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
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

      <section className="bg-[#f8f3e9] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-8">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-[#004ac6]">
                Selected work
              </p>
              <h2 className="mt-4 max-w-2xl font-headline text-4xl font-bold tracking-tight text-[#1d1c16] md:text-5xl">
                Recent posts and the next place to go.
              </h2>
            </div>
            <Link href="/archive" className="border-b-2 border-[#004ac6] pb-1 font-label text-sm font-bold uppercase tracking-[0.2em] text-[#004ac6]">
              View archive
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-12">
            <article className="group overflow-hidden rounded-3xl bg-[#ede8de] shadow-[0_24px_70px_rgba(16,34,54,0.08)] md:col-span-8">
              {imageSourceFor(featuredPost) ? (
                <div className="relative h-72 overflow-hidden md:h-80">
                  <img
                    src={imageSourceFor(featuredPost) as string}
                    alt={featuredPost.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(29,28,22,0)_40%,rgba(29,28,22,0.35)_100%)]" />
                </div>
              ) : null}
              <div className="p-10 md:p-12">
                <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#555f70]">
                  {primaryTag(featuredPost)}
                </p>
                <h3 className="mt-4 max-w-3xl font-headline text-3xl font-bold leading-tight text-[#1d1c16] transition-colors group-hover:text-[#004ac6] md:text-4xl">
                  <Link href={`/posts/${featuredPost.slug}`}>
                    {featuredPost.title}
                  </Link>
                </h3>
                <p className="mt-4 max-w-3xl text-xl leading-relaxed text-[#555f70]">
                  {excerptFor(featuredPost)}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {featuredPost.tags.slice(0, 4).map((tag) => (
                    <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="rounded-sm bg-[#f8f3e9] px-3 py-1 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#555f70] transition-colors hover:bg-[#e7e2d8]">
                      {tag}
                    </Link>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.22em] text-[#555f70]">
                  <span>{dateFormatter.format(featuredPost.date)}</span>
                  <span>{featuredPost.readingTime ? `${featuredPost.readingTime} min read` : 'Long-form note'}</span>
                  <Link href={`/posts/${featuredPost.slug}`} className="font-bold text-[#004ac6] transition-transform hover:translate-x-1">
                    Read the post
                  </Link>
                </div>
              </div>
            </article>

            <div className="flex flex-col gap-8 md:col-span-4">
              {supportingPosts.map((post) => (
                <article key={post.slug} className="group flex-1 rounded-3xl bg-[#ede8de] p-8 shadow-[0_24px_70px_rgba(16,34,54,0.06)]">
                  <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#555f70]">
                    {primaryTag(post)}
                  </p>
                  <h3 className="mt-4 font-headline text-2xl font-bold leading-tight text-[#1d1c16] transition-colors group-hover:text-[#004ac6]">
                    <Link href={`/posts/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-[#555f70]">
                    {excerptFor(post)}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="rounded-sm bg-[#f8f3e9] px-2 py-1 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#555f70]">
                        {tag}
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            {secondaryPost && (
              <article className="overflow-hidden rounded-3xl bg-[#1d1c16] text-[#fef9ef] shadow-[0_24px_70px_rgba(16,34,54,0.12)] md:col-span-5">
                <div className="p-10">
                  <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#b4c5ff]">
                    {secondaryPost.tags[0] ? secondaryPost.tags[0] : 'Related work'}
                  </p>
                  <h3 className="mt-4 max-w-xl font-headline text-3xl font-bold leading-tight">
                    <Link href={`/posts/${secondaryPost.slug}`} className="transition-colors hover:text-[#b4c5ff]">
                      {secondaryPost.title}
                    </Link>
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-[#e7e2d8]">
                    {excerptFor(secondaryPost)}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/book" className="rounded-lg bg-[#2563eb] px-6 py-3 font-label text-xs font-bold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#004ac6]">
                      Follow the book
                    </Link>
                    <Link href="/publications" className="rounded-lg bg-[#ede8de] px-6 py-3 font-label text-xs font-bold uppercase tracking-[0.22em] text-[#1d1c16] transition-colors hover:bg-[#f8f3e9]">
                      Publications
                    </Link>
                  </div>
                </div>
              </article>
            )}

            <article className="overflow-hidden rounded-3xl bg-[#ede8de] p-10 shadow-[0_24px_70px_rgba(16,34,54,0.06)] md:col-span-7">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#004ac6]">
                Upcoming publication
              </p>
              <h3 className="mt-4 max-w-2xl font-headline text-4xl font-black leading-tight text-[#1d1c16] md:text-5xl">
                Agent Memory.
              </h3>
              <p className="mt-6 max-w-2xl text-xl leading-relaxed text-[#555f70]">
                A practical guide to how AI systems remember, retrieve, compress, and act on information in production. The book extends the same technical arc as the posts and talks.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/book" className="rounded-lg bg-[#1d1c16] px-8 py-4 font-label text-xs font-bold uppercase tracking-[0.22em] text-[#fef9ef] transition-transform hover:-translate-y-1">
                  Notify me when it&apos;s ready
                </Link>
                <Link href="/about" className="rounded-lg bg-[#f8f3e9] px-8 py-4 font-label text-xs font-bold uppercase tracking-[0.22em] text-[#1d1c16] transition-transform hover:-translate-y-1">
                  About the author
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 py-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-[#004ac6]">
              Stay in touch
            </p>
            <h2 className="mt-4 max-w-2xl font-headline text-5xl font-black tracking-tighter text-[#1d1c16] md:text-6xl">
              The Labaschin Letter.
            </h2>
            <p className="mt-6 max-w-2xl text-2xl leading-relaxed text-[#555f70]">
              Occasional deep-dives into economics, engineering, and the future of human-agent collaboration. If you want the work, the fastest path is still direct email.
            </p>
          </div>

          <div className="rounded-3xl border border-[#c3c6d7]/40 bg-white/70 p-8 shadow-[0_24px_70px_rgba(16,34,54,0.06)] lg:col-span-5">
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#555f70]">
              Actual next step
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[#1d1c16]">
              There is no fake signup form here. Email if you want updates on Agent Memory or want to talk about the posts, talks, or publications.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="mailto:benjaminlabaschindev@gmail.com?subject=Agent%20Memory%20updates"
                className="rounded-lg bg-[#1d1c16] px-6 py-3 font-label text-xs font-bold uppercase tracking-[0.22em] text-[#fef9ef] transition-transform hover:-translate-y-1"
              >
                Email updates
              </a>
              <Link href="/about" className="rounded-lg bg-[#ede8de] px-6 py-3 font-label text-xs font-bold uppercase tracking-[0.22em] text-[#1d1c16] transition-transform hover:-translate-y-1">
                About / CV
              </Link>
              <Link href="/publications" className="rounded-lg bg-[#ede8de] px-6 py-3 font-label text-xs font-bold uppercase tracking-[0.22em] text-[#1d1c16] transition-transform hover:-translate-y-1">
                Publications
              </Link>
            </div>
          </div>
        </div>
      </section>
    </EditorialPageFrame>
  );
}
