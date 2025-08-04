import Link from 'next/link';
import { postService } from '../services/PostService';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Archives | Economic Notes',
  description: 'Browse all posts organized by month and year.',
};

export default async function ArchivesPage() {
  const archives = await postService.getArchiveByMonth();
  
  // Group archives by year
  const archivesByYear = archives.reduce((acc, archive) => {
    const year = new Date(archive.month).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(archive);
    return acc;
  }, {} as Record<number, typeof archives>);

  return (
    <div className="archives-page">
      <h1 className="page-title">Archives</h1>
      
      <div className="archives-content">
        {Object.entries(archivesByYear)
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([year, yearArchives]) => (
            <div key={year} className="archive-year-card">
              <div className="year-header">
                <h3>{year}</h3>
                <div className="year-divider"></div>
              </div>
              
              <div className="archive-months-grid">
                {yearArchives.map((archive) => (
                  <Link
                    key={archive.month}
                    href={`/archives/${encodeURIComponent(archive.month)}`}
                    className="archive-month-card"
                  >
                    <div className="month-content">
                      <div className="month-name">{archive.month}</div>
                      <div className="post-count">
                        <span className="count-number">{archive.count}</span>
                        <span className="count-label">post{archive.count !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <div className="month-arrow">→</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}