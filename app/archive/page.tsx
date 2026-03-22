import { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { postService } from '../services/PostService';

export const metadata: Metadata = {
  title: 'Archive | Ben Labaschin',
  description: 'Browse the full writing archive by year and month.',
};

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
});

const rowStyle = {
  paddingTop: '1rem',
  borderTop: '1px solid rgba(26, 36, 51, 0.12)',
  display: 'grid',
  gap: '0.75rem',
} as const;

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
        monthLabel: monthFormatter.format(post.date),
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

  return (
    <EditorialPageFrame currentPath="/archive" pageClassName="editorial-book-page">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy" style={{ maxWidth: '46rem' }}>
          <p className="editorial-home-kicker">Archive</p>
          <h1 className="editorial-page-title">Archive</h1>
          <p className="editorial-page-copy">
            Browse the full post history by year and month, with each month kept close to the underlying posts instead of hidden behind a heavier archive view.
          </p>
          <div className="editorial-chip-row">
            <span className="editorial-chip">By year</span>
            <span className="editorial-chip">By month</span>
            <span className="editorial-chip">Every post linked</span>
            <Link href="/posts" className="editorial-chip">
              Posts
            </Link>
          </div>
        </div>
      </section>

      {years.map((year) => (
        <section key={year} className="editorial-list-section">
          <div className="editorial-list-heading">
            <p className="editorial-home-section-label">Year {year}</p>
            <h2 className="editorial-page-section-title">Monthly index for {year}.</h2>
          </div>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {postsByYear[year].map(({ monthLabel, monthHref, posts: monthPosts }) => (
              <article key={`${year}-${monthLabel}`} style={rowStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'baseline' }}>
                  <div>
                    <p className="editorial-home-card-label">{monthLabel}</p>
                    <h3 style={{ margin: 0 }}>
                      <Link href={monthHref}>{monthLabel}</Link>
                    </h3>
                  </div>
                  <span className="editorial-post-summary">
                    {monthPosts.length} post{monthPosts.length !== 1 ? 's' : ''}
                  </span>
                </div>
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
                <Link href={monthHref} className="editorial-post-link">
                  Open month
                </Link>
              </article>
            ))}
          </div>
        </section>
      ))}
    </EditorialPageFrame>
  );
}
