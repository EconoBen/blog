import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EditorialPageFrame } from '../../components/EditorialPageFrame';
import { postService } from '../../services/PostService';

interface ArchivePageProps {
  params: Promise<{
    month: string;
  }>;
}

const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

function getMonthParts(month: string) {
  const [year, monthNum] = month.split('-');

  if (!year || !monthNum || Number.isNaN(Number.parseInt(year, 10)) || Number.isNaN(Number.parseInt(monthNum, 10))) {
    return null;
  }

  return { year, monthNum };
}

async function getPostsForMonth(month: string) {
  const parts = getMonthParts(month);
  if (!parts) {
    return null;
  }

  const { year, monthNum } = parts;
  const allPosts = await postService.getAllPosts();
  const monthPosts = allPosts.filter((post) => {
    const postYear = post.date.getFullYear().toString();
    const postMonth = `${post.date.getMonth() + 1}`.padStart(2, '0');
    return postYear === year && postMonth === monthNum;
  });

  return { year, monthNum, monthPosts };
}

export default async function ArchiveMonthPage({ params }: ArchivePageProps) {
  const { month } = await params;
  const monthData = await getPostsForMonth(month);

  if (!monthData || monthData.monthPosts.length === 0) {
    notFound();
  }

  const { year, monthNum, monthPosts } = monthData;
  const label = new Date(Number.parseInt(year, 10), Number.parseInt(monthNum, 10) - 1).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
  const [monthName, yearLabel] = label.split(' ');
  const uniqueTags = new Set(monthPosts.flatMap((post) => post.tags)).size;

  return (
    <EditorialPageFrame currentPath="/archive">
      <main className="mx-auto max-w-7xl px-8 py-16">
        <div className="mb-16 max-w-3xl">
          <div className="mb-6 flex items-center gap-2 font-headline text-[10px] uppercase tracking-[0.2em] text-secondary">
            <Link href="/archive" className="transition-colors hover:text-primary">
              Archive
            </Link>
            <span>/</span>
            <span className="font-bold text-on-surface">{yearLabel}</span>
            <span>/</span>
            <span className="font-bold text-on-surface">{monthName}</span>
          </div>
          <h1 className="mb-4 font-headline text-6xl font-black tracking-tighter text-on-surface md:text-8xl">
            {monthName} <span className="font-body font-light italic text-primary">{yearLabel}</span>
          </h1>
          <p className="max-w-2xl font-body text-xl leading-relaxed text-on-surface-variant md:text-2xl">
            A straight month index with every post preserved and easy to scan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-8">
            <div className="flex flex-wrap items-center gap-4 border-y border-outline-variant/20 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-secondary">
              <span>{monthPosts.length} post{monthPosts.length === 1 ? '' : 's'}</span>
              <span className="h-1 w-1 rounded-full bg-outline-variant" />
              <span>{uniqueTags} unique tags</span>
              <span className="h-1 w-1 rounded-full bg-outline-variant" />
              <span>{yearLabel}</span>
            </div>

            <div className="divide-y divide-outline-variant/20 border-y border-outline-variant/20">
              {monthPosts.map((post) => (
                <article key={post.slug} className="py-8">
                  <time className="mb-3 block font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
                    {longDateFormatter.format(post.date)}
                  </time>
                  <h2 className="mb-3 font-headline text-3xl font-bold tracking-tight text-on-surface transition-colors hover:text-primary md:text-4xl">
                    <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  </h2>
                  {post.summary ? (
                    <p className="max-w-2xl font-body text-lg leading-relaxed text-on-surface-variant">
                      {post.summary}
                    </p>
                  ) : null}
                  {post.tags.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {post.tags.slice(0, 5).map((tag) => (
                        <Link
                          key={`${post.slug}-${tag}`}
                          href={`/tags/${encodeURIComponent(tag)}`}
                          className="rounded-sm bg-surface-container-highest px-2 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-secondary transition-colors hover:bg-surface-container-high hover:text-on-surface"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <aside className="space-y-8 lg:sticky lg:top-32">
            <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-8">
              <h3 className="mb-6 font-headline text-xs font-bold uppercase tracking-widest text-secondary">
                Month at a glance
              </h3>
              <ul className="space-y-4">
                {[
                  ['Posts', `${monthPosts.length}`],
                  ['Unique tags', `${uniqueTags}`],
                  ['Year', yearLabel ?? year],
                ].map(([labelText, value]) => (
                  <li key={labelText} className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                    <span className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">{labelText}</span>
                    <span className="font-headline text-lg font-bold text-on-surface">{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-outline-variant/20 bg-surface p-8">
              <h3 className="mb-4 font-headline text-xs font-bold uppercase tracking-widest text-secondary">Navigate</h3>
              <div className="flex flex-col gap-3">
                <Link href="/archive" className="font-label text-xs font-bold uppercase tracking-widest text-primary">
                  Back to archive
                </Link>
                <Link href="/tags" className="font-label text-xs font-bold uppercase tracking-widest text-primary">
                  Browse tags
                </Link>
                <Link href="/search" className="font-label text-xs font-bold uppercase tracking-widest text-primary">
                  Search archive
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </EditorialPageFrame>
  );
}

export async function generateStaticParams() {
  const allPosts = await postService.getAllPosts();
  const months = new Set<string>();

  allPosts.forEach((post) => {
    const year = post.date.getFullYear();
    const month = `${post.date.getMonth() + 1}`.padStart(2, '0');
    months.add(`${year}-${month}`);
  });

  return Array.from(months).map((month) => ({ month }));
}

export async function generateMetadata({ params }: ArchivePageProps): Promise<Metadata> {
  const { month } = await params;
  const monthData = await getPostsForMonth(month);

  if (!monthData || monthData.monthPosts.length === 0) {
    return { title: 'Archive Not Found | ECONOBEN.DEV' };
  }

  const label = new Date(Number.parseInt(monthData.year, 10), Number.parseInt(monthData.monthNum, 10) - 1).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return {
    title: `${label} | Archive | ECONOBEN.DEV`,
    description: `Browse ${monthData.monthPosts.length} post${monthData.monthPosts.length === 1 ? '' : 's'} from ${label}.`,
  };
}
