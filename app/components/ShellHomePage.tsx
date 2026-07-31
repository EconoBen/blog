import Link from 'next/link';
import { AGENT_MEMORY, OREILLY_LINKS } from '../book/bookData';
import type { Post } from '../services/PostService';
import { BookCover } from './BookCover';
import { EditorialPageFrame } from './EditorialPageFrame';
import { TrackedAction } from './TrackedAction';

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
    <section className="grebe-page-content mx-auto max-w-[1440px] px-5 py-24 md:px-8 md:py-32">
      <div className="max-w-3xl">
        <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-[#176b69]">
          AI/ML Engineering &amp; Writing
        </p>
        <h1 className="mt-6 font-headline text-4xl font-black tracking-tight text-[#211e1f] md:text-5xl">
          Writing about how AI systems remember, fail, and scale.
        </h1>
        <p className="mt-6 max-w-2xl font-body text-2xl leading-relaxed text-[#555f70] md:text-3xl">
          The archive is loading, but the rest of the site is live—including Agent Memory, now in Early Release from O&rsquo;Reilly.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <TrackedAction
            href="/book"
            eventName="homepage_book_click"
            eventProperties={{ placement: 'empty_state' }}
            className="rounded-lg bg-[#176b69] px-8 py-4 font-headline text-sm font-bold uppercase tracking-wider text-white shadow-[0_14px_28px_rgba(23,107,105,0.18)] transition-transform hover:-translate-y-1"
            style={{ color: '#fff', WebkitTextFillColor: '#fff' }}
          >
            Explore the book
          </TrackedAction>
          <Link
            href="/about"
            className="rounded-lg bg-[#ede8de] px-8 py-4 font-headline text-sm font-bold uppercase tracking-wider text-[#211e1f] transition-transform hover:-translate-y-1"
          >
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
  const discoveryPosts = restPosts.slice(0, 3);
  const topTags = topTagsFor(posts);

  return (
    <EditorialPageFrame currentPath="/" pageClassName="shell-home-page">
      <div className="grebe-page-content">
        <section className="mx-auto max-w-[1440px] px-5 pb-20 pt-14 md:px-8 md:pb-24 md:pt-28">
          <div className="grid gap-14 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-[#176b69]">
                AI/ML Engineering &amp; Writing
              </p>
              <h1 className="mt-6 max-w-4xl font-headline text-5xl font-black tracking-tighter text-[#211e1f] md:text-7xl lg:text-8xl">
                Writing about how AI systems{' '}
                <span className="font-body font-normal italic text-[#176b69]">remember</span>, fail, and scale.
              </h1>
              <p className="mt-6 max-w-2xl font-body text-2xl leading-relaxed text-[#555f70] md:text-3xl">
                Posts, talks, tools, and the work behind <em>Agent Memory</em>—now in Early Release from O&rsquo;Reilly.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <TrackedAction
                  href="/book"
                  eventName="homepage_book_click"
                  eventProperties={{ placement: 'hero' }}
                  className="w-full rounded-lg bg-[#176b69] px-8 py-4 text-center font-headline text-xs font-bold uppercase tracking-wider text-white transition-transform hover:-translate-y-1 hover:bg-[#105c5a] focus:outline-none focus:ring-2 focus:ring-[#176b69]/35 focus:ring-offset-2 sm:w-auto sm:text-sm"
                  style={{ color: '#fff', WebkitTextFillColor: '#fff' }}
                >
                  Explore Agent Memory
                </TrackedAction>
                <Link
                  href="/posts"
                  className="w-full rounded-lg bg-[#ede8de] px-8 py-4 text-center font-headline text-xs font-bold uppercase tracking-wider text-[#211e1f] transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#211e1f]/15 focus:ring-offset-2 sm:w-auto sm:text-sm"
                >
                  Browse selected writing
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-3">
                {topTags.map(([tag, count]) => (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="rounded-sm bg-[#ede8de] px-3 py-1 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#555f70] transition-all hover:-translate-y-0.5 hover:bg-[#e7e2d8] hover:text-[#176b69]"
                  >
                    {tag} ({count})
                  </Link>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-5">
              <Link
                href={`/posts/${featuredPost.slug}`}
                className="group block no-underline"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                <article className="relative cursor-pointer overflow-hidden rounded-[2rem] border border-[#176b69]/12 bg-[#edf2ea] p-6 text-[#211e1f] shadow-[0_24px_70px_rgba(33,30,31,0.12)] transition-transform duration-300 hover:-translate-y-1 sm:p-9">
                  <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-[#84b8b1]/22" aria-hidden="true" />
                  <div className="relative">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-full bg-[#d95a2e] px-3 py-1 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                        Latest post
                      </span>
                      <time className="font-label text-[10px] font-bold uppercase tracking-[0.16em] text-[#555f70]">
                        {dateFormatter.format(featuredPost.date)}
                      </time>
                    </div>
                    <p className="mt-8 font-label text-[10px] font-bold uppercase tracking-[0.25em] text-[#176b69]">
                      {primaryTag(featuredPost)}
                    </p>
                    <h2 className="mt-3 font-headline text-3xl font-black leading-[1.02] tracking-[-0.025em] text-[#211e1f] transition-colors group-hover:text-[#176b69] sm:text-4xl">
                      {featuredPost.title}
                    </h2>
                    <p className="mt-5 font-body text-lg leading-relaxed text-[#555f70]">
                      {excerptFor(featuredPost)}
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#176b69]/16 pt-5">
                      <span className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#555f70]">
                        {featuredPost.readingTime ? `${featuredPost.readingTime} min read` : 'Read now'}
                      </span>
                      <span className="font-label text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#176b69]">
                        Read the post →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </aside>
          </div>
        </section>

        <section className="border-y border-[#176b69]/14 bg-[#fffdf8]/74">
          <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-5 py-14 md:grid-cols-[1fr_auto] md:px-8 md:py-18">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#b9140b] px-3 py-1 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                  Early Release
                </span>
                <span className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#555f70]">
                  Chapters 1 &amp; 2 live
                </span>
              </div>
              <h2 className="mt-5 font-headline text-4xl font-black tracking-[-0.035em] text-[#211e1f] md:text-5xl">
                {AGENT_MEMORY.title}
              </h2>
              <p className="mt-3 max-w-2xl font-body text-xl leading-relaxed text-[#555f70]">
                {AGENT_MEMORY.subtitle}
              </p>
              <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-[#211e1f]">
                A practical engineering book about deciding what becomes memory, writing it safely, retrieving it well, and operating the system over time.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <TrackedAction
                  href="/book"
                  eventName="homepage_book_click"
                  eventProperties={{ placement: 'book_spotlight' }}
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#176b69] px-6 py-3 font-headline text-xs font-bold uppercase tracking-[0.1em] text-white transition-transform hover:-translate-y-0.5"
                  style={{ color: '#fff', WebkitTextFillColor: '#fff' }}
                >
                  See the book
                </TrackedAction>
                <TrackedAction
                  href={OREILLY_LINKS.homepage}
                  eventName="oreilly_read_click"
                  eventProperties={{ source: 'homepage', placement: 'book_spotlight' }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#176b69]/25 px-6 py-3 font-headline text-xs font-bold uppercase tracking-[0.1em] text-[#176b69] transition-transform hover:-translate-y-0.5"
                >
                  Read on O&rsquo;Reilly
                </TrackedAction>
              </div>
            </div>
            <BookCover size="compact" className="mx-auto md:mx-0" />
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-20">
          <div className="h-px w-full bg-[#211e1f]/8" />
          <h2 className="mt-6 font-headline text-2xl font-black text-[#176b69]">Current Focus</h2>
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
                title: 'Agent Memory for O\u2019Reilly',
                body: 'Writing a practical guide to stateful AI agents that remember, adapt, and work across time. Chapters 1 and 2 are available now, with new chapters arriving throughout Early Release.',
                stat: 'Early Release',
              },
              {
                label: 'Speaking',
                title: 'Agent Memory on Stage',
                body: 'Turning the book into practical talks about persistent state, context, and memory systems. Speaking throughout 2026 at conferences and meetups.',
                stat: '2026 engagements open',
              },
            ].map((item) => (
              <div key={item.label} className="sticky-note flex flex-col p-5 md:p-7">
                <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#176b69]">{item.label}</p>
                <h3 className="mt-3 font-headline text-2xl font-bold text-[#211e1f]">{item.title}</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-[#555f70]">{item.body}</p>
                <p className="mt-auto pt-5 font-label text-[11px] font-bold uppercase tracking-[0.1em] text-[#d95a2e]">{item.stat}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 sm:py-20 md:py-24">
          <div className="mx-auto max-w-[1440px] px-5 md:px-8">
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4 sm:mb-12">
              <p className="inline-block rounded-sm bg-[#dfeae5] px-2 py-1 font-label text-xs font-bold uppercase tracking-[0.2em] text-[#211e1f]">
                Selected work
              </p>
              <Link
                href="/archive"
                className="border-b border-[#211e1f] pb-0.5 font-label text-xs font-bold uppercase tracking-[0.2em] text-[#211e1f] transition-all hover:-translate-y-0.5 hover:border-[#176b69] hover:text-[#176b69]"
              >
                View archive
              </Link>
            </div>

            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
              {discoveryPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  className="group block h-full no-underline"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  <article className="sticky-note flex h-full cursor-pointer flex-col overflow-hidden p-5 transition-transform duration-300 hover:-translate-y-1 md:p-7">
                    <p className="font-label text-[10px] font-bold uppercase tracking-[0.25em] text-[#176b69]">
                      {primaryTag(post)}
                    </p>
                    <h3 className="mt-3 font-headline text-2xl font-bold leading-snug text-[#211e1f] transition-colors group-hover:text-[#176b69]">
                      {post.title}
                    </h3>
                    <time className="mt-3 block font-label text-[10px] uppercase tracking-widest text-[#555f70]">
                      {dateFormatter.format(post.date)}
                    </time>
                    <p className="mt-4 flex-1 font-body text-base leading-relaxed text-[#211e1f]">
                      {excerptFor(post, 135)}
                    </p>
                    <span className="mt-6 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#176b69]">
                      Read the post →
                    </span>
                  </article>
                </Link>
              ))}

              <TrackedAction
                href="/book"
                eventName="homepage_book_click"
                eventProperties={{ placement: 'selected_work' }}
                className="group block h-full no-underline"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                <article className="sticky-note grid h-full cursor-pointer grid-cols-[1fr_auto] gap-5 overflow-hidden p-5 transition-transform duration-300 hover:-translate-y-1 md:p-7 lg:grid-cols-1">
                  <div className="flex min-w-0 flex-col">
                    <p className="font-label text-[10px] font-bold uppercase tracking-[0.25em] text-[#d95a2e]">
                      Early Release book
                    </p>
                    <h3 className="mt-3 font-headline text-2xl font-bold leading-snug text-[#211e1f] transition-colors group-hover:text-[#176b69]">
                      Agent Memory
                    </h3>
                    <p className="mt-4 flex-1 font-body text-base leading-relaxed text-[#211e1f]">
                      A practical guide to building stateful AI agents that remember, adapt, and work across time.
                    </p>
                    <span className="mt-6 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#176b69]">
                      Explore the book →
                    </span>
                  </div>
                  <BookCover size="compact" className="w-20 self-start sm:w-24 lg:mt-5 lg:w-28" />
                </article>
              </TrackedAction>
            </div>
          </div>
        </section>
      </div>
    </EditorialPageFrame>
  );
}
