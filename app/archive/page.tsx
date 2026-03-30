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
  const totalMonths = sortedEntries.length;
  const topYear = years[0];
  const latestMonth = sortedEntries[0];

  return (
    <EditorialPageFrame currentPath="/archive" pageClassName="editorial-book-page">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy" style={{ maxWidth: '46rem' }}>
          <p className="editorial-home-kicker">Archive</p>
          <h1 className="editorial-page-title">Archive</h1>
          <p className="editorial-page-copy">
            Browse the full post history by year and month, with a cleaner chronology and every month kept one click away.
          </p>
          <div className="editorial-breadcrumb" aria-label="Archive navigation">
            <Link href="/posts">Posts</Link>
            <span>/</span>
            <span>Archive</span>
          </div>
          <div className="editorial-chip-row">
            <span className="editorial-chip">By year</span>
            <span className="editorial-chip">By month</span>
            <span className="editorial-chip">Every post linked</span>
            <Link href="/posts" className="editorial-chip">
              Posts
            </Link>
          </div>
        </div>
        <aside className="editorial-archive-callout">
          <p className="editorial-home-card-label">Editorial callout</p>
          <h3 style={{ marginTop: '8px' }}>A month-by-month chronology with direct entry points.</h3>
          <p>
            The archive keeps the browsing model simple: jump by year, open a month, then continue into the underlying posts without losing context.
          </p>
          <div className="editorial-page-metric-list" style={{ marginTop: '14px' }}>
            <div>
              <span className="editorial-page-metric-value">{posts.length}</span>
              <span className="editorial-page-metric-label">Total posts</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">{totalMonths}</span>
              <span className="editorial-page-metric-label">Monthly buckets</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">{topYear ?? '—'}</span>
              <span className="editorial-page-metric-label">Most recent year in the archive</span>
            </div>
          </div>
          {latestMonth ? (
            <div className="editorial-chip-row">
              <Link href={latestMonth.monthHref} className="editorial-chip">
                Latest month
              </Link>
              <Link href={`/archives/${latestMonth.year}-${String(latestMonth.month + 1).padStart(2, '0')}`} className="editorial-chip">
                Open newest bucket
              </Link>
            </div>
          ) : null}
        </aside>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Year navigation</p>
          <h2 className="editorial-page-section-title">Jump directly to the year you want to read.</h2>
        </div>
        <div className="editorial-year-jump">
          {years.map((year) => (
            <a key={year} href={`#archive-year-${year}`} className="editorial-filter-chip">
              {year}
            </a>
          ))}
        </div>
      </section>

      {years.map((year) => (
        <section key={year} id={`archive-year-${year}`} className="editorial-list-section">
          <div className="editorial-list-heading">
            <p className="editorial-home-section-label">Year {year}</p>
            <h2 className="editorial-page-section-title">Monthly index for {year}.</h2>
          </div>
          <div className="editorial-month-grid">
            {postsByYear[year].map(({ monthLabel, monthHref, posts: monthPosts }) => {
              const leadPost = monthPosts[0];

              return (
                <article key={`${year}-${monthLabel}`} className="editorial-month-card">
                  <div className="editorial-post-row-header">
                    <div className="editorial-post-row-title">
                      <p className="editorial-home-card-label">{monthLabel} {year}</p>
                      <h3 style={{ margin: '6px 0 0' }}>
                        <Link href={monthHref}>{monthLabel} {year}</Link>
                      </h3>
                    </div>
                    <span className="editorial-post-summary">
                      {monthPosts.length} post{monthPosts.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {leadPost ? (
                    <div className="editorial-discovery-card" style={{ marginTop: '8px', padding: '18px 18px 20px' }}>
                      <p className="editorial-home-card-label">Lead post</p>
                      <h3 style={{ marginTop: '8px' }}>
                        <Link href={`/posts/${leadPost.slug}`}>{leadPost.title}</Link>
                      </h3>
                      {leadPost.summary && <p className="editorial-post-summary">{leadPost.summary}</p>}
                      <div className="editorial-chip-row">
                        {leadPost.tags.slice(0, 3).map((tag) => (
                          <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                            {tag}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <ul className="posts-list" style={{ marginTop: '12px' }}>
                    {monthPosts.slice(0, 4).map((post) => (
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

                  <div className="editorial-link-row">
                    <Link href={monthHref} className="editorial-post-link">
                      Open month
                    </Link>
                    <Link href="/posts" className="editorial-post-link">
                      All posts
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </EditorialPageFrame>
  );
}
