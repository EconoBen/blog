import { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { postService } from '../services/PostService';

export const metadata: Metadata = {
  title: 'Archive | Economic Notes',
  description: 'Browse all posts by year and month in the Economic Notes archive.',
};

export default async function ArchivePage() {
  const posts = await postService.getAllPosts();
  const postsByYearMonth = posts.reduce((acc, post) => {
    const year = post.date.getFullYear();
    const month = post.date.getMonth();
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

    if (!acc[monthKey]) {
      acc[monthKey] = {
        year,
        month,
        monthLabel: post.date.toLocaleDateString('en-US', { month: 'long' }),
        monthHref: `/archives/${monthKey}`,
        posts: [],
      };
    }

    acc[monthKey].posts.push(post);
    return acc;
  }, {} as Record<string, { year: number; month: number; monthLabel: string; monthHref: string; posts: typeof posts }>);

  const sortedEntries = Object.values(postsByYearMonth).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  const postsByYear = sortedEntries.reduce((acc, entry) => {
    if (!acc[entry.year]) {
      acc[entry.year] = [];
    }
    acc[entry.year].push(entry);
    return acc;
  }, {} as Record<number, typeof sortedEntries>);

  const years = Object.keys(postsByYear).map(Number).sort((a, b) => b - a);
  const uniqueTags = new Set(posts.flatMap((post) => post.tags)).size;

  return (
    <EditorialPageFrame currentPath="/archive" pageClassName="editorial-book-page">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">Archive</p>
          <h1 className="editorial-page-title">Archive</h1>
          <p className="editorial-page-copy">
            Browse the full post history by year and month, with links preserved at both the month and individual post level.
          </p>
        </div>
        <aside className="editorial-page-aside">
          <p className="editorial-home-card-label">Archive at a glance</p>
          <div className="editorial-page-metric-list">
            <div>
              <span className="editorial-page-metric-value">{posts.length}</span>
              <span className="editorial-page-metric-label">total posts</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">{years.length}</span>
              <span className="editorial-page-metric-label">years represented</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">{uniqueTags}</span>
              <span className="editorial-page-metric-label">unique tags across the archive</span>
            </div>
          </div>
        </aside>
      </section>

      {years.map((year) => (
        <section key={year} className="editorial-list-section">
          <div className="editorial-list-heading">
            <p className="editorial-home-section-label">Year {year}</p>
            <h2 className="editorial-page-section-title">Monthly index for {year}.</h2>
          </div>
          <div className="months-grid">
            {postsByYear[year].map(({ monthLabel, monthHref, posts: monthPosts }) => (
              <div key={`${year}-${monthLabel}`} className="month-section">
                <h3 className="month-heading">
                  <Link href={monthHref}>{monthLabel}</Link>
                  <span className="post-count">({monthPosts.length})</span>
                </h3>
                <ul className="posts-list">
                  {monthPosts.map((post) => (
                    <li key={post.slug} className="archive-post">
                      <Link href={`/posts/${post.slug}`}>
                        <time className="archive-post-date">
                          {post.date.getDate().toString().padStart(2, '0')}
                        </time>
                        <span className="archive-post-title">{post.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ))}
    </EditorialPageFrame>
  );
}
