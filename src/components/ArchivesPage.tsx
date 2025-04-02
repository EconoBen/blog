import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../services/PostService';

/**
 * Interface for archive data with month and count
 */
interface ArchiveData {
  month: string;
  count: number;
}

/**
 * ArchivesPage component to display all archive months
 *
 * @returns {JSX.Element} The rendered ArchivesPage component
 */
const ArchivesPage: React.FC = () => {
  const [archives, setArchives] = useState<ArchiveData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Loads archive data
     */
    const loadArchives = async (): Promise<void> => {
      setLoading(true);
      try {
        const archiveData = await postService.getArchiveByMonth();
        setArchives(archiveData);
      } catch (err) {
        console.error('Failed to load archives:', err);
        setError('Failed to load archives');
      } finally {
        setLoading(false);
      }
    };

    loadArchives();
  }, []);

  /**
   * Groups archive items by year
   *
   * @returns {Record<string, ArchiveData[]>} Grouped archives by year
   */
  const groupByYear = (): Record<string, ArchiveData[]> => {
    const grouped: Record<string, ArchiveData[]> = {};

    archives.forEach(archive => {
      const year = archive.month.split(' ')[1]; // Extract year from "Month Year"
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(archive);
    });

    // Sort years in descending order
    return Object.keys(grouped)
      .sort((a, b) => parseInt(b) - parseInt(a))
      .reduce((result, year) => {
        result[year] = grouped[year];
        return result;
      }, {} as Record<string, ArchiveData[]>);
  };

  if (loading) {
    return <div className="archives-page-loading">Loading archives...</div>;
  }

  if (error) {
    return <div className="archives-page-error">{error}</div>;
  }

  const groupedArchives = groupByYear();

  return (
    <div className="archives-page">
      <h1>Archives</h1>
      <p className="archives-intro">
        Browse all blog posts by month. Click on a month to see all posts published during that period.
      </p>

      {Object.keys(groupedArchives).length === 0 ? (
        <div className="no-archives">No archives available.</div>
      ) : (
        Object.entries(groupedArchives).map(([year, months]) => (
          <div key={year} className="archive-year">
            <h2>{year}</h2>
            <div className="archive-months">
              {months.map(archive => (
                <div key={archive.month} className="archive-month-item">
                  <Link to={`/archives/${encodeURIComponent(archive.month)}`} className="archive-month-link">
                    {archive.month.split(' ')[0]} {/* Just display the month part */}
                  </Link>
                  <span className="archive-count">{archive.count} posts</span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ArchivesPage;
