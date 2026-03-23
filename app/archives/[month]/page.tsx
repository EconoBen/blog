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
  const [featuredPost, ...remainingPosts] = monthPosts;
  const uniqueTags = new Set(monthPosts.flatMap((post) => post.tags)).size;

  return (
    <EditorialPageFrame currentPath="/archive">
      <main className="mx-auto max-w-7xl px-8 py-16">
        <div className="mb-20">
          <div className="mb-6 flex items-center gap-2 font-headline text-[10px] uppercase tracking-[0.2em] text-secondary">
            <Link href="/archive" className="transition-colors hover:text-primary">Archive</Link>
            <span>/</span>
            <span className="font-bold text-on-surface">{yearLabel}</span>
            <span>/</span>
            <span className="font-bold text-on-surface">{monthName}</span>
          </div>
          <h1 className="mb-4 font-headline text-6xl font-black tracking-tighter text-on-surface md:text-8xl">
            {monthName} <span className="font-body font-light italic text-primary">{yearLabel}</span>
          </h1>
          <p className="max-w-2xl font-body text-xl leading-relaxed text-on-surface-variant md:text-2xl">
            A month view of the archive with the full set of posts preserved, but framed around the strongest entry first so the page reads like a curated issue.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <article className="rounded-xl bg-surface-container-low p-8 transition-colors duration-300 hover:bg-surface-container-high lg:col-span-8 md:p-12">
            <div className="flex flex-col gap-10 md:flex-row">
              <div className="md:w-1/3">
                <div className="rounded-lg bg-surface-container-highest p-6">
                  <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Featured Post</p>
                  <p className="mt-6 font-headline text-5xl font-black text-on-surface">{monthPosts.length}</p>
                  <p className="mt-3 font-body text-sm leading-relaxed text-on-surface-variant">
                    Post{monthPosts.length === 1 ? '' : 's'} published in {label}.
                  </p>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-center">
                <time className="mb-4 font-headline text-xs font-bold uppercase tracking-widest text-secondary">
                  {featuredPost ? longDateFormatter.format(featuredPost.date) : label}
                </time>
                <h2 className="mb-6 font-headline text-3xl font-extrabold leading-tight text-on-surface transition-colors hover:text-primary md:text-4xl">
                  <Link href={`/posts/${featuredPost.slug}`}>{featuredPost.title}</Link>
                </h2>
                {featuredPost.summary ? (
                  <p className="mb-8 font-body text-lg leading-relaxed text-on-surface-variant">
                    {featuredPost.summary}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  {featuredPost.tags.slice(0, 5).map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${encodeURIComponent(tag)}`}
                      className="rounded-sm bg-surface px-3 py-1 font-label text-[10px] font-bold uppercase tracking-widest text-secondary transition-colors hover:bg-surface-container-highest hover:text-on-surface"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <aside className="space-y-8 lg:col-span-4 lg:sticky lg:top-32">
            <div className="rounded-xl bg-surface-container-highest p-8">
              <h3 className="mb-6 font-headline text-xs font-bold uppercase tracking-widest text-secondary">In This Month</h3>
              <ul className="space-y-4">
                {[
                  ['Posts', `${monthPosts.length}`],
                  ['Unique tags', `${uniqueTags}`],
                  ['Year', yearLabel ?? year],
                ].map(([labelText, value]) => (
                  <li key={labelText} className="flex items-center justify-between border-b border-on-surface/5 pb-3">
                    <span className="font-headline text-sm font-medium text-on-surface">{labelText}</span>
                    <span className="font-body text-lg italic text-primary">{value}</span>
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
              </div>
            </div>
          </aside>

          {remainingPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 lg:col-span-8 md:grid-cols-2">
              {remainingPosts.map((post) => (
                <article
                  key={post.slug}
                  className="rounded-xl bg-surface-container-low p-8 transition-colors duration-300 hover:bg-surface-container-high"
                >
                  <time className="mb-3 block font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
                    {longDateFormatter.format(post.date)}
                  </time>
                  <h3 className="mb-3 font-headline text-2xl font-bold leading-tight text-on-surface">
                    <Link href={`/posts/${post.slug}`} className="transition-colors hover:text-primary">
                      {post.title}
                    </Link>
                  </h3>
                  {post.summary ? (
                    <p className="mb-5 font-body text-base leading-relaxed text-on-surface-variant">
                      {post.summary}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 4).map((tag) => (
                      <Link
                        key={`${post.slug}-${tag}`}
                        href={`/tags/${encodeURIComponent(tag)}`}
                        className="rounded-sm bg-surface px-2 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-secondary transition-colors hover:bg-surface-container-highest hover:text-on-surface"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : null}
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
