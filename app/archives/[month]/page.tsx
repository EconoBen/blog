import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EditorialPageFrame } from '../../components/EditorialPageFrame';
import { postService } from '../../../services/PostService';

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

const rowStyle = {
  paddingTop: '1rem',
  borderTop: '1px solid rgba(26, 36, 51, 0.12)',
  display: 'grid',
  gap: '0.75rem',
} as const;

function getMonthParts(month: string) {
  const [year, monthNum] = month.split('-');

  if (!year || !monthNum || isNaN(parseInt(year)) || isNaN(parseInt(monthNum))) {
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
    const postDate = new Date(post.date);
    const postYear = postDate.getFullYear().toString();
    const postMonth = (postDate.getMonth() + 1).toString().padStart(2, '0');

    return postYear === year && postMonth === monthNum;
  });

  return { year, monthNum, monthPosts };
}

function MonthPostRow({ post }: { post: Awaited<ReturnType<typeof postService.getAllPosts>>[number] }) {
  return (
    <article style={rowStyle}>
      <div className="editorial-post-row-header">
        <div className="editorial-post-row-title">
          <p className="editorial-home-card-label">{longDateFormatter.format(post.date)}</p>
          <h3 style={{ margin: 0 }}>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
          </h3>
        </div>
        <span className="editorial-post-summary">
          {post.readingTime ? `${post.readingTime} min read` : 'Post'}
        </span>
      </div>
      {post.summary && <p className="editorial-post-summary">{post.summary}</p>}
      <div className="editorial-chip-row">
        {post.tags.slice(0, 4).map((tag) => (
          <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
            {tag}
          </Link>
        ))}
      </div>
    </article>
  );
}

export default async function ArchivePage({ params }: ArchivePageProps) {
  const { month } = await params;
  const monthData = await getPostsForMonth(month);

  if (!monthData) {
    notFound();
  }

  const { year, monthNum, monthPosts } = monthData;

  if (monthPosts.length === 0) {
    notFound();
  }

  const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  const monthTagCounts = new Map<string, number>();
  monthPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      monthTagCounts.set(tag, (monthTagCounts.get(tag) ?? 0) + 1);
    });
  });
  const topMonthTags = Array.from(monthTagCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const leadPost = monthPosts[0];

  return (
    <EditorialPageFrame currentPath="/archive" pageClassName="editorial-book-page">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy" style={{ maxWidth: '46rem' }}>
          <p className="editorial-home-kicker">Archive month</p>
          <h1 className="editorial-page-title">{monthName}</h1>
          <p className="editorial-page-copy">
            Posts published in {monthName}, ordered newest first and framed as a content-led monthly archive.
          </p>
          <div className="editorial-breadcrumb" aria-label="Archive month breadcrumb">
            <Link href="/archive">Archive</Link>
            <span>/</span>
            <span>{monthName}</span>
          </div>
          <div className="editorial-chip-row">
            <span className="editorial-chip">{monthPosts.length} posts</span>
            <span className="editorial-chip">Newest first</span>
            <Link href="/archive" className="editorial-chip">
              Back to archive
            </Link>
          </div>
        </div>
        <aside className="editorial-page-aside">
          <p className="editorial-home-card-label">Month notes</p>
          <div className="editorial-page-metric-list" style={{ marginTop: '12px' }}>
            <div>
              <span className="editorial-page-metric-value">{monthPosts.length}</span>
              <span className="editorial-page-metric-label">Posts published this month</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">{topMonthTags.length}</span>
              <span className="editorial-page-metric-label">Top tags carrying the monthly signal</span>
            </div>
          </div>
          <div className="editorial-chip-row" style={{ marginTop: '16px' }}>
            {topMonthTags.length > 0 ? (
              topMonthTags.map(([tag, count]) => (
                <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                  {tag} <span>({count})</span>
                </Link>
              ))
            ) : (
              <span className="editorial-chip">No tags</span>
            )}
          </div>
        </aside>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Content-led layout</p>
          <h2 className="editorial-page-section-title">The month opens with the strongest post and then falls back to the full list.</h2>
        </div>
        <div className="editorial-month-feature">
          <article className="editorial-discovery-card is-featured">
            <div>
              <p className="editorial-home-card-label">Featured post in this month</p>
              <h2 style={{ marginTop: '10px' }}>
                <Link href={`/posts/${leadPost.slug}`}>{leadPost.title}</Link>
              </h2>
              {leadPost.summary && <p className="editorial-post-summary">{leadPost.summary}</p>}
              <div className="editorial-post-meta-panel" style={{ marginTop: '16px' }}>
                <span>{longDateFormatter.format(leadPost.date)}</span>
                <span>{leadPost.readingTime ? `${leadPost.readingTime} min read` : 'Post'}</span>
                <Link href={`/posts/${leadPost.slug}`}>Open post</Link>
              </div>
              <div className="editorial-chip-row">
                {leadPost.tags.slice(0, 5).map((tag) => (
                  <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
            <aside className="editorial-discovery-card-aside">
              <div className="editorial-page-aside">
                <p className="editorial-home-card-label">Why it is featured</p>
                <p className="editorial-page-copy" style={{ marginTop: '10px' }}>
                  The lead post anchors the month and gives the reader an immediate entry point before the smaller items in the list.
                </p>
              </div>
            </aside>
          </article>

          <div className="editorial-search-sidebar-card">
            <p className="editorial-home-card-label">Month context</p>
            <h3 style={{ marginTop: '8px' }}>{monthName}</h3>
            <p style={{ marginTop: '10px' }}>
              The month bucket preserves the underlying post URLs, tag links, and markdown rendering while making the chronology easier to scan.
            </p>
            <div className="editorial-link-row">
              <Link href="/posts" className="editorial-post-link">
                Posts
              </Link>
              <Link href="/tags" className="editorial-post-link">
                Tags
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Monthly posts</p>
          <h2 className="editorial-page-section-title">Everything published during this month.</h2>
        </div>
        <div style={{ display: 'grid', gap: '14px' }}>
          {monthPosts.slice(1).map((post) => (
            <MonthPostRow key={post.slug} post={post} />
          ))}
          {monthPosts.length === 1 ? (
            <p className="editorial-post-summary">This month only contains the featured post above.</p>
          ) : null}
        </div>
      </section>
    </EditorialPageFrame>
  );
}

export async function generateStaticParams() {
  const allPosts = await postService.getAllPosts();

  const months = new Set<string>();

  allPosts.forEach((post) => {
    const postDate = new Date(post.date);
    const year = postDate.getFullYear();
    const month = (postDate.getMonth() + 1).toString().padStart(2, '0');
    months.add(`${year}-${month}`);
  });

  return Array.from(months).map((month) => ({
    month,
  }));
}

export async function generateMetadata({ params }: ArchivePageProps): Promise<Metadata> {
  const { month } = await params;
  const monthData = await getPostsForMonth(month);

  if (!monthData) {
    return {
      title: 'Archive Not Found',
    };
  }

  const { year, monthNum, monthPosts } = monthData;
  const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return {
    title: `Posts from ${monthName} | Ben Labaschin`,
    description: `Browse ${monthPosts.length} post${monthPosts.length === 1 ? '' : 's'} from ${monthName}.`,
  };
}
