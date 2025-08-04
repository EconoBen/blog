import { Metadata } from 'next';
import Link from 'next/link';
import { postService } from '../services/PostService';

export const metadata: Metadata = {
  title: 'Archive | Economic Notes',
  description: 'Browse all posts by year and month in the Economic Notes archive.',
};

export default async function ArchivePage() {
  const posts = await postService.getAllPosts();
  
  // Group posts by year and month
  const postsByYearMonth = posts.reduce((acc, post) => {
    const year = post.date.getFullYear();
    const month = post.date.getMonth();
    const key = `${year}-${month}`;
    
    if (!acc[key]) {
      acc[key] = {
        year,
        month,
        monthName: post.date.toLocaleDateString('en-US', { month: 'long' }),
        posts: []
      };
    }
    
    acc[key].posts.push(post);
    return acc;
  }, {} as Record<string, { year: number; month: number; monthName: string; posts: typeof posts }>);

  // Sort by year and month
  const sortedEntries = Object.values(postsByYearMonth).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  // Group by year for display
  const postsByYear = sortedEntries.reduce((acc, entry) => {
    if (!acc[entry.year]) {
      acc[entry.year] = [];
    }
    acc[entry.year].push(entry);
    return acc;
  }, {} as Record<number, typeof sortedEntries>);

  const years = Object.keys(postsByYear).map(Number).sort((a, b) => b - a);

  return (
    <div className="archive-page">
      <div className="page-header">
        <h1 className="page-title">Archive</h1>
        <p className="page-subtitle">
          {posts.length} posts across {years.length} years
        </p>
      </div>

      <div className="archive-content">
        {years.map(year => (
          <section key={year} className="archive-year">
            <h2 className="year-heading">{year}</h2>
            
            <div className="months-grid">
              {postsByYear[year].map(({ monthName, posts: monthPosts }) => (
                <div key={`${year}-${monthName}`} className="month-section">
                  <h3 className="month-heading">
                    {monthName} 
                    <span className="post-count">({monthPosts.length})</span>
                  </h3>
                  
                  <ul className="posts-list">
                    {monthPosts.map(post => (
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
      </div>

      <div className="archive-stats">
        <h2 className="stats-heading">Post Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{posts.length}</div>
            <div className="stat-label">Total Posts</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{years.length}</div>
            <div className="stat-label">Years Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {Math.round(posts.length / years.length)}
            </div>
            <div className="stat-label">Posts per Year</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {new Set(posts.flatMap(p => p.tags)).size}
            </div>
            <div className="stat-label">Unique Tags</div>
          </div>
        </div>
      </div>
    </div>
  );
}