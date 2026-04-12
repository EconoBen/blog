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
          AI/ML Engineering &amp; Writing
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
      {/* ── Hero — editorial headline + featured post ── */}
      <section className="mx-auto max-w-[1440px] px-8 pb-20 pt-14 md:pb-24 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-[#0035a0]">
              AI/ML Engineering &amp; Writing
            </p>
            <h1 className="mt-6 max-w-4xl font-headline text-5xl font-black tracking-tighter text-[#1d1c16] md:text-7xl lg:text-8xl">
              Writing about how AI systems <span className="font-body italic font-normal text-[#0035a0]">remember</span>, fail, and scale.
            </h1>
            <p className="mt-6 max-w-2xl text-2xl leading-relaxed text-[#555f70] md:text-3xl">
              Posts, talks, publications, and the work surrounding my upcoming O&rsquo;Reilly book on AI agent memory.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/book" className="rounded-lg bg-[#0035a0] px-8 py-4 font-headline text-sm font-bold uppercase tracking-wider text-white transition-transform hover:-translate-y-1 hover:bg-[#002a80]" style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}>
                Follow the book
              </Link>
              <Link href="/posts" className="rounded-lg bg-[#ede8de] px-8 py-4 font-headline text-sm font-bold uppercase tracking-wider text-[#1d1c16] transition-transform hover:-translate-y-1">
                Browse selected writing
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              {topTags.map(([tag, count]) => (
                <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="rounded-sm bg-[#ede8de] px-3 py-1 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#555f70] transition-all hover:-translate-y-0.5 hover:bg-[#e7e2d8] hover:text-[#0035a0]">
                  {tag} ({count})
                </Link>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-5">
            <Link href={`/posts/${featuredPost.slug}`} className="block text-inherit no-underline">
              <article className="cursor-pointer overflow-hidden rounded-3xl bg-[#e8eef8] text-[#1d1c16] shadow-[0_24px_70px_rgba(16,34,54,0.14)] transition-transform duration-300 hover:-translate-y-1">
                <div className="relative h-72 overflow-hidden">
                  {imageSourceFor(featuredPost) ? (
                    <img
                      src={imageSourceFor(featuredPost) as string}
                      alt={featuredPost.title}
                      className="h-full w-full object-cover opacity-85"
                    />
                  ) : (
                    <div className="flex h-full items-end bg-[linear-gradient(135deg,#e8eef8_0%,#e8eef8_100%)] p-8">
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
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(232,238,248,0)_35%,rgba(232,238,248,0.84)_100%)]" />
                  <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#1d1c16]">
                    <span className="rounded-sm bg-[#0035a0] px-3 py-1 font-label font-bold text-white" style={{ color: '#fff', WebkitTextFillColor: '#fff' }}>
                      Latest post
                    </span>
                    <span className="font-label font-bold">{dateFormatter.format(featuredPost.date)}</span>
                  </div>
                </div>
                <div className="p-8">
                  <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#0035a0]">
                    {primaryTag(featuredPost)}
                  </p>
                  <h2 className="mt-4 font-headline text-3xl font-bold leading-tight text-[#1d1c16] md:text-4xl">
                    {featuredPost.title}
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
                    <span className="inline-flex items-center gap-2 font-label text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#0035a0]">
                      Read the post
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          </aside>
        </div>
      </section>

      {/* ── Current Focus ── */}
      <section className="mx-auto max-w-[1440px] px-8 py-14">
        <div className="h-px w-full bg-[#1d1c16]/8" />
        <h2 className="font-headline text-2xl font-black" style={{ color: '#0035a0', marginTop: '1.5rem' }}>Current Focus</h2>
        <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              label: 'Building',
              title: 'Enterprise GenAI',
              body: 'Founding engineer at Workhelix, building the Nucleus platform that helps enterprises measure and grow AI ROI. Async LLM APIs, embedding pipelines, and agent deployment for Fortune 50 customers like Autodesk and Nasdaq.',
              stat: 'Founding Engineer',
            },
            {
              label: 'Writing',
              title: 'An O\u2019Reilly Book on Agent Memory',
              body: 'Writing Agent Memory: Building Stateful AI Agents That Remember, Adapt, and Work Across Time for O\u2019Reilly. Previously published two O\u2019Reilly reports on AI agents and co-authored AEA research on how LLMs reshape firm-level labor exposure.',
              stat: 'Book in progress',
            },
            {
              label: 'Speaking',
              title: 'What\u2019s Next on Stage',
              body: 'Turning the Agent Memory book into live talks: how to build AI agents that persist state, manage context, and work across sessions. Speaking throughout 2026 at conferences and meetups. Interested in having me speak? Let\u2019s talk.',
              stat: '2026 engagements open',
            },
          ].map((item) => (
            <div key={item.label} className="sticky-note flex flex-col p-7">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#0035a0]">{item.label}</p>
              <h3 className="mt-3 font-headline text-2xl font-bold text-[#1d1c16]">{item.title}</h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-[#555f70]">{item.body}</p>
              <p className="mt-auto pt-5 font-label text-[11px] font-bold uppercase tracking-[0.1em] text-[#0035a0]">{item.stat}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-[1440px] px-8">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 sm:mb-12">
            <p className="inline-block rounded-sm bg-[#dce5ff] px-2 py-1 font-label text-xs font-bold uppercase tracking-[0.2em] text-[#1d1c16]">
              Selected work
            </p>
            <Link href="/archive" className="border-b border-[#1d1c16] pb-0.5 font-label text-xs font-bold uppercase tracking-[0.2em] text-[#1d1c16] transition-all hover:-translate-y-0.5 hover:text-[#0035a0] hover:border-[#0035a0]">
              View archive
            </Link>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[leadDiscoveryPost, ...supportingPosts, secondaryPost].filter(Boolean).map((post) => (
              <Link key={(post as Post).slug} href={`/posts/${(post as Post).slug}`} className="group block h-full text-inherit no-underline">
                <article className="sticky-note flex h-full cursor-pointer flex-col overflow-hidden p-8 transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex flex-1 flex-col">
                    <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#1d1c16]">
                      {primaryTag(post as Post)}
                    </p>
                    <h3 className="mt-2 font-headline text-2xl font-bold leading-snug text-[#1d1c16] transition-colors group-hover:text-[#0035a0]">
                      {(post as Post).title}
                    </h3>
                    <time className="mt-3 block font-label text-[10px] uppercase tracking-widest text-[#555f70]">{dateFormatter.format((post as Post).date)}</time>
                    <p className="mt-4 flex-1 text-base leading-relaxed text-[#1d1c16]">
                      {excerptFor(post as Post, 140)}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {(post as Post).tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-full border border-[#c0c4cc] bg-transparent px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-[#1d1c16]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5">
                      <span className="inline-flex items-center justify-center rounded-lg border border-[#c0c4cc] bg-transparent px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-[#1d1c16]">
                        Read the post
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}

            <Link href="/book" className="group block h-full text-inherit no-underline">
              <article className="sticky-note flex h-full cursor-pointer flex-col overflow-hidden p-8 transition-transform duration-300 hover:-translate-y-1">
                <div className="flex flex-1 flex-col">
                  <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#1d1c16]">
                    Upcoming publication
                  </p>
                  <h3 className="mt-2 font-headline text-2xl font-bold leading-snug text-[#1d1c16] transition-colors group-hover:text-[#0035a0]">
                    Agent Memory
                  </h3>
                  <p className="mt-4 flex-1 text-base leading-relaxed text-[#1d1c16]">
                    A practical guide to how AI systems remember, retrieve, compress, and act on information in production. The book extends the same technical arc as the posts and talks.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-[#c0c4cc] bg-transparent px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-[#1d1c16]">AI Memory</span>
                    <span className="rounded-full border border-[#c0c4cc] bg-transparent px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-[#1d1c16]">Production Systems</span>
                    <span className="rounded-full border border-[#c0c4cc] bg-transparent px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-[#1d1c16]">Book</span>
                  </div>
                  <div className="mt-5">
                    <span className="inline-flex items-center justify-center rounded-lg border border-[#c0c4cc] bg-transparent px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-[#1d1c16]">
                      Follow the book
                    </span>
                  </div>
                </div>
              </article>
            </Link>
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
