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

export default async function ArchivePage({ params }: ArchivePageProps) {
  const { month } = await params;
  const [year, monthNum] = month.split('-');

  if (!year || !monthNum || isNaN(parseInt(year)) || isNaN(parseInt(monthNum))) {
    notFound();
  }

  const allPosts = await postService.getAllPosts();
  const monthPosts = allPosts.filter((post) => {
    const postDate = new Date(post.date);
    const postYear = postDate.getFullYear().toString();
    const postMonth = (postDate.getMonth() + 1).toString().padStart(2, '0');

    return postYear === year && postMonth === monthNum;
  });

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
            Posts published in {monthName}, ordered newest first and linked back to the archive index.
          </p>
        </div>
        <aside className="editorial-page-aside">
          <p className="editorial-home-card-label">Month at a glance</p>
          <div className="editorial-page-metric-list">
            <div>
              <span className="editorial-page-metric-value">{monthPosts.length}</span>
              <span className="editorial-page-metric-label">posts in this month</span>
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
          <h2 className="editorial-page-section-title">Everything published during this month.</h2>
        </div>
        <div className="editorial-post-grid">
          {monthPosts.map((post) => (
            <article key={post.slug} className="editorial-post-card">
              <div className="editorial-post-meta">
                <span>{post.date.toLocaleDateString('en-US', { month: 'long' })}</span>
                <span>{post.date.getFullYear()}</span>
              </div>
              <h2>{post.title}</h2>
              {post.summary && <p className="editorial-post-summary">{post.summary}</p>}
              <div className="editorial-chip-row">
                {post.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="editorial-chip">
                    {tag}
                  </span>
                ))}
              </div>
              <Link href={`/posts/${post.slug}`} className="editorial-post-link">
                Read post
              </Link>
            </article>
          ))}
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
  const [year, monthNum] = month.split('-');

  if (!year || !monthNum) {
    return {
      title: 'Archive Not Found',
    };
  }

  const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return {
    title: `Posts from ${monthName} - Economic Notes`,
    description: `Browse all blog posts from ${monthName}`,
  };
}
