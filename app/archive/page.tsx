import { Metadata } from 'next';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/NavBar';
import { SidebarToggle } from '../components/SidebarToggle';
import { postService } from '../services/PostService';

export const metadata: Metadata = {
  title: 'Archive | Economic Notes',
  description: 'Browse all posts by year and month in the Economic Notes archive.',
};

export default async function ArchivePage() {
  const posts = await postService.getAllPosts();

  // Build months: key = YYYY-MM
  const months = new Map<string, { year: number; month: number; name: string; count: number }>();
  posts.forEach((post) => {
    const d = new Date(post.date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const key = `${year}-${String(month).padStart(2, '0')}`;
    if (!months.has(key)) {
      months.set(key, {
        year,
        month,
        name: d.toLocaleDateString('en-US', { month: 'long' }),
        count: 0,
      });
    }
    months.get(key)!.count += 1;
  });

  // Group by year, sorted desc
  const grouped = new Map<number, Array<{ key: string; name: string; count: number }>>();
  Array.from(months.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .forEach(([key, m]) => {
      if (!grouped.has(m.year)) grouped.set(m.year, []);
      grouped.get(m.year)!.push({ key, name: m.name, count: m.count });
    });

  const years = Array.from(grouped.keys()).sort((a, b) => b - a);
  const recentPosts = posts.slice(0, 10);

  return (
    <div className="blog-container">
      <Sidebar posts={recentPosts} />

      <div className="main-content">
        <NavBar />

        <div className="content-wrapper archives-content">
          {years.map((year) => (
            <section key={year} className="archive-year-card">
              <div className="year-header">
                <h3>{year}</h3>
                <div className="year-divider" />
              </div>

              <div className="archive-months-grid">
                {grouped.get(year)!.map(({ key, name, count }) => (
                  <Link
                    key={key}
                    href={`/archives/${key}`}
                    className="archive-month-card"
                  >
                    <div className="month-content">
                      <div className="month-name">{name}</div>
                      <div className="post-count">
                        <span className="count-number">{count}</span>
                        <span className="count-label">posts</span>
                      </div>
                    </div>
                    <span className="month-arrow">→</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <SidebarToggle />
      </div>
    </div>
  );
}