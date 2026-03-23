import type { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { postService } from '../services/PostService';

export const metadata: Metadata = {
  title: 'Archive | ECONOBEN.DEV',
  description: 'Browse the writing archive by year and month.',
};

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
});

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
});

type ArchiveMonth = {
  key: string;
  year: number;
  month: number;
  monthLabel: string;
  monthHref: string;
  posts: Awaited<ReturnType<typeof postService.getAllPosts>>;
};

export default async function ArchivePage() {
  const posts = await postService.getAllPosts();
  const archiveByMonth = posts.reduce<Record<string, ArchiveMonth>>((acc, post) => {
    const year = post.date.getFullYear();
    const month = post.date.getMonth();
    const key = `${year}-${String(month + 1).padStart(2, '0')}`;

    if (!acc[key]) {
      acc[key] = {
        key,
        year,
        month,
        monthLabel: monthFormatter.format(post.date),
        monthHref: `/archives/${key}`,
        posts: [],
      };
    }

    acc[key].posts.push(post);
    return acc;
  }, {});

  const months = Object.values(archiveByMonth).sort((a, b) => {
    if (a.year !== b.year) {
      return b.year - a.year;
    }

    return b.month - a.month;
  });

  const monthsByYear = months.reduce<Record<number, ArchiveMonth[]>>((acc, month) => {
    acc[month.year] ??= [];
    acc[month.year].push(month);
    return acc;
  }, {});

  const years = Object.keys(monthsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  const uniqueTags = new Set(posts.flatMap((post) => post.tags)).size;
  const latestMonth = months[0];

  return (
    <EditorialPageFrame currentPath="/archive">
      <main className="mx-auto max-w-7xl px-8 pb-32 pt-20">
        <header className="mb-24 max-w-3xl">
          <span className="mb-4 block font-label text-xs uppercase tracking-[0.2em] text-secondary">
            Chronological Index
          </span>
          <h1 className="mb-8 font-headline text-6xl font-black tracking-tighter text-on-surface md:text-7xl">
            Archive.
          </h1>
          <p className="font-body text-xl italic leading-relaxed text-on-surface-variant md:text-2xl">
            Every post, grouped by year and month so the archive reads like a history of work instead of a flat directory.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <nav className="sticky top-32 space-y-10">
              <div>
                <h2 className="mb-6 font-label text-[10px] uppercase tracking-[0.3em] text-secondary">
                  Filter by Year
                </h2>
                <ul className="space-y-3 font-label text-sm">
                  {years.map((year, index) => (
                    <li key={year}>
                      <a
                        href={`#year-${year}`}
                        className={index === 0
                          ? 'block border-l-2 border-primary pl-4 font-bold text-primary'
                          : 'block pl-4 text-on-surface-variant transition-colors hover:text-on-surface'}
                      >
                        {year}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-surface-container-low p-6">
                <h3 className="mb-2 font-headline text-sm font-bold text-on-surface">Archive Snapshot</h3>
                <div className="space-y-4 font-label text-xs uppercase tracking-widest text-secondary">
                  <div className="flex items-center justify-between gap-4">
                    <span>Total posts</span>
                    <span className="font-headline text-lg font-bold text-on-surface">{posts.length}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Years covered</span>
                    <span className="font-headline text-lg font-bold text-on-surface">{years.length}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Unique tags</span>
                    <span className="font-headline text-lg font-bold text-on-surface">{uniqueTags}</span>
                  </div>
                </div>
                {latestMonth ? (
                  <Link
                    href={latestMonth.monthHref}
                    className="mt-6 inline-flex items-center gap-2 font-label text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:text-primary-container"
                  >
                    Latest month: {latestMonth.monthLabel} {latestMonth.year}
                  </Link>
                ) : null}
              </div>
            </nav>
          </aside>

          <div className="space-y-24 lg:col-span-9">
            {years.map((year) => (
              <section key={year} id={`year-${year}`} className="scroll-mt-32">
                <div className="mb-12 flex items-baseline gap-4">
                  <h2 className="font-headline text-4xl font-black tracking-tighter text-on-surface">{year}</h2>
                  <div className="h-px flex-grow bg-outline-variant opacity-20" />
                </div>

                <div className="space-y-16">
                  {monthsByYear[year].map((entry) => (
                    <section key={entry.key}>
                      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
                        <div>
                          <h3 className="font-headline text-2xl font-bold text-on-surface">{entry.monthLabel}</h3>
                          <p className="mt-1 font-body text-base text-on-surface-variant">
                            {entry.posts.length} post{entry.posts.length === 1 ? '' : 's'} published in {entry.monthLabel} {year}.
                          </p>
                        </div>
                        <Link
                          href={entry.monthHref}
                          className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary transition-colors hover:text-primary-container"
                        >
                          View month
                        </Link>
                      </div>

                      <article className="rounded-xl bg-surface-container-low p-8">
                        <div className="space-y-6">
                          {entry.posts.map((post, index) => (
                            <Link
                              key={post.slug}
                              href={`/posts/${post.slug}`}
                              className={`block transition-colors hover:text-primary ${index > 0 ? 'border-t border-outline-variant/20 pt-6' : ''}`}
                            >
                              <div className="grid gap-3 md:grid-cols-[110px_minmax(0,1fr)] md:gap-6">
                                <div className="font-label text-xs uppercase tracking-widest text-secondary">
                                  {shortDateFormatter.format(post.date)}
                                </div>
                                <div>
                                  <h4 className="font-headline text-xl font-bold text-on-surface">{post.title}</h4>
                                  {post.summary ? (
                                    <p className="mt-2 font-body text-base leading-relaxed text-on-surface-variant">
                                      {post.summary}
                                    </p>
                                  ) : null}
                                  {post.tags.length > 0 ? (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                      {post.tags.slice(0, 4).map((tag) => (
                                        <span
                                          key={`${post.slug}-${tag}`}
                                          className="rounded-sm bg-surface-container-highest px-2 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-secondary"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </article>
                    </section>
                  ))}
                </div>
              </section>
            ))}

            <section className="relative overflow-hidden rounded-xl bg-surface-container-highest p-12 lg:-ml-[10%] lg:mr-[10%]">
              <div className="relative z-10 max-w-xl">
                <h3 className="mb-4 font-headline text-3xl font-bold">Keep up with the archive.</h3>
                <p className="mb-8 font-body text-lg leading-relaxed text-on-surface-variant">
                  If you prefer browsing by subject instead of date, move from the archive into tags or search without losing your place.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/tags"
                    className="rounded-md bg-primary-container px-6 py-3 font-label text-sm font-bold uppercase tracking-widest text-on-primary"
                  >
                    Browse tags
                  </Link>
                  <Link
                    href="/search"
                    className="rounded-md border border-outline-variant bg-surface px-6 py-3 font-label text-sm font-bold uppercase tracking-widest text-on-surface transition-colors hover:bg-surface-container-low"
                  >
                    Search archive
                  </Link>
                </div>
              </div>
              <div className="absolute right-[-10%] top-[-20%] h-64 w-64 rounded-full bg-primary opacity-5 blur-3xl" />
            </section>
          </div>
        </div>
      </main>
    </EditorialPageFrame>
  );
}
