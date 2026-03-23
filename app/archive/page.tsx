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

type ArchiveYear = {
  year: number;
  months: ArchiveMonth[];
  postCount: number;
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
  const yearEntries: ArchiveYear[] = years.map((year) => ({
    year,
    months: monthsByYear[year],
    postCount: monthsByYear[year].reduce((count, month) => count + month.posts.length, 0),
  }));

  const uniqueTags = new Set(posts.flatMap((post) => post.tags)).size;
  const latestMonth = months[0];

  return (
    <EditorialPageFrame currentPath="/archive">
      <main className="mx-auto max-w-7xl px-8 pb-28 pt-20">
        <header className="mb-20 max-w-3xl">
          <span className="mb-4 block font-label text-xs uppercase tracking-[0.2em] text-secondary">
            Chronological Index
          </span>
          <h1 className="mb-8 font-headline text-6xl font-black tracking-tighter text-on-surface md:text-7xl">
            Archive.
          </h1>
          <p className="font-body text-xl italic leading-relaxed text-on-surface-variant md:text-2xl">
            Browse the full writing record by year and month. The structure stays compact, practical, and fully linked.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <nav className="sticky top-32 space-y-10">
              <div>
                <h2 className="mb-6 font-label text-[10px] uppercase tracking-[0.3em] text-secondary">
                  Years
                </h2>
                <ul className="space-y-3 font-label text-sm">
                  {yearEntries.map((entry, index) => (
                    <li key={entry.year}>
                      <a
                        href={`#year-${entry.year}`}
                        className={index === 0
                          ? 'flex items-center justify-between border-l-2 border-primary pl-4 font-bold text-primary'
                          : 'flex items-center justify-between pl-4 text-on-surface-variant transition-colors hover:text-on-surface'}
                      >
                        <span>{entry.year}</span>
                        <span className="text-[10px] uppercase tracking-[0.2em]">{entry.months.length} month{entry.months.length === 1 ? '' : 's'}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-outline-variant/20 bg-surface p-6">
                <h3 className="mb-4 font-headline text-sm font-bold text-on-surface">Archive at a glance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 border-b border-outline-variant/20 pb-3">
                    <span className="font-label text-[10px] uppercase tracking-widest text-secondary">Total posts</span>
                    <span className="font-headline text-lg font-bold text-on-surface">{posts.length}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-outline-variant/20 pb-3">
                    <span className="font-label text-[10px] uppercase tracking-widest text-secondary">Years covered</span>
                    <span className="font-headline text-lg font-bold text-on-surface">{years.length}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-outline-variant/20 pb-3">
                    <span className="font-label text-[10px] uppercase tracking-widest text-secondary">Unique tags</span>
                    <span className="font-headline text-lg font-bold text-on-surface">{uniqueTags}</span>
                  </div>
                </div>
                {latestMonth ? (
                  <Link
                    href={latestMonth.monthHref}
                    className="mt-6 inline-flex items-center gap-2 font-label text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:text-primary-container"
                  >
                    Latest month {latestMonth.monthLabel} {latestMonth.year}
                  </Link>
                ) : null}
              </div>
            </nav>
          </aside>

          <div className="space-y-20 lg:col-span-9">
            {yearEntries.map((entry) => (
              <section key={entry.year} id={`year-${entry.year}`} className="scroll-mt-32">
                <div className="mb-10 flex flex-col gap-3 border-b border-outline-variant/20 pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="font-headline text-4xl font-black tracking-tighter text-on-surface">{entry.year}</h2>
                    <p className="mt-2 font-body text-base leading-relaxed text-on-surface-variant">
                      {entry.months.length} month{entry.months.length === 1 ? '' : 's'} and {entry.postCount} post{entry.postCount === 1 ? '' : 's'} in the record.
                    </p>
                  </div>
                  <span className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary">
                    Year index
                  </span>
                </div>

                <div className="space-y-12">
                  {entry.months.map((month) => (
                    <section key={month.key} className="border-l border-outline-variant/20 pl-6">
                      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
                        <div>
                          <h3 className="font-headline text-2xl font-bold text-on-surface">{month.monthLabel}</h3>
                          <p className="mt-1 font-body text-base text-on-surface-variant">
                            {month.posts.length} post{month.posts.length === 1 ? '' : 's'} published in {month.monthLabel} {entry.year}.
                          </p>
                        </div>
                        <Link
                          href={month.monthHref}
                          className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary transition-colors hover:text-primary-container"
                        >
                          Open month
                        </Link>
                      </div>

                      <div className="divide-y divide-outline-variant/20 border-y border-outline-variant/20">
                        {month.posts.map((post) => (
                          <Link
                            key={post.slug}
                            href={`/posts/${post.slug}`}
                            className="block py-5 transition-colors hover:text-primary"
                          >
                            <div className="grid gap-3 md:grid-cols-[110px_minmax(0,1fr)] md:gap-6">
                              <div className="font-label text-xs uppercase tracking-widest text-secondary">
                                {shortDateFormatter.format(post.date)}
                              </div>
                              <div>
                                <h4 className="font-headline text-xl font-bold text-on-surface">{post.title}</h4>
                                {post.summary ? (
                                  <p className="mt-2 max-w-2xl font-body text-base leading-relaxed text-on-surface-variant">
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
                    </section>
                  ))}
                </div>
              </section>
            ))}

            <section className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-10">
              <div className="max-w-xl">
                <h3 className="mb-4 font-headline text-3xl font-bold">Keep browsing.</h3>
                <p className="mb-8 font-body text-lg leading-relaxed text-on-surface-variant">
                  Move from the archive into tags or search when subject matters more than date.
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
            </section>
          </div>
        </div>
      </main>
    </EditorialPageFrame>
  );
}
