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

  return (
    <EditorialPageFrame currentPath="/archive" pageClassName="editorial-book-page">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">Archive month</p>
          <h1 className="editorial-page-title">{monthName}</h1>
          <p className="editorial-page-copy">
            Posts published in {monthName}, ordered newest first and framed as a single reading pass instead of a long list.
          </p>
          <div className="editorial-chip-row">
            <span className="editorial-chip">{monthPosts.length} posts</span>
            <span className="editorial-chip">Newest first</span>
            <span className="editorial-chip">Archive link preserved</span>
          </div>
        </div>
        <aside className="editorial-page-aside">
          <p className="editorial-home-card-label">Month at a glance</p>
          <div className="editorial-page-metric-list">
            <div>
              <span className="editorial-page-metric-value">{monthPosts.length}</span>
              <span className="editorial-page-metric-label">posts in this month</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">
                {new Set(monthPosts.flatMap((post) => post.tags)).size}
              </span>
              <span className="editorial-page-metric-label">unique tags in month</span>
            </div>
            <div>
              <Link href="/archive" className="editorial-post-link">
                Back to archive
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Posts</p>
          <h2 className="editorial-page-section-title">Everything published during this month, kept in one readable stack.</h2>
        </div>
        <article className="editorial-home-card">
          <p className="editorial-home-card-label">Month index</p>
          <h3>{monthName}</h3>
          <p>
            {monthPosts.length} post{monthPosts.length !== 1 ? 's' : ''} arranged newest first, with summaries and topic links left visible for scanning.
          </p>
          {monthPosts[0] ? (
            <div>
              <p className="editorial-home-card-label">Featured post</p>
              <Link href={`/posts/${monthPosts[0].slug}`} className="editorial-home-card-link">
                {monthPosts[0].title}
              </Link>
              {monthPosts[0].summary && <p className="editorial-post-summary">{monthPosts[0].summary}</p>}
              <div className="editorial-chip-row">
                {monthPosts[0].tags.slice(0, 4).map((tag) => (
                  <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
          <ul className="posts-list">
            {monthPosts.slice(1).map((post) => (
              <li key={post.slug} className="archive-post">
                <Link href={`/posts/${post.slug}`}>
                  <time className="archive-post-date">{longDateFormatter.format(post.date)}</time>
                  <span className="archive-post-title">{post.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/archive" className="editorial-home-card-link">
            Back to archive
          </Link>
        </article>
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
