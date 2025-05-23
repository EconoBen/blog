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
   * Groups archive items by year and sorts months within each year from newest to oldest
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

    // Sort months within each year from newest to oldest
    Object.keys(grouped).forEach(year => {
      grouped[year].sort((a, b) => {
        const monthA = new Date(a.month);
        const monthB = new Date(b.month);
        return monthB.getTime() - monthA.getTime();
      });
    });

    // Return the grouped object without sorting here
    return grouped;
  };

  /**
   * Get years in descending order (newest to oldest)
   *
   * @param {Record<string, ArchiveData[]>} grouped - Grouped archives by year
   * @returns {string[]} Years sorted in descending order
   */
  const getSortedYears = (grouped: Record<string, ArchiveData[]>): string[] => {
    return Object.keys(grouped).sort((a, b) => parseInt(b) - parseInt(a));
  };

  if (loading) {
    return (
      <div className="archives-page">
        <div className="component-box">
          <div className="component-header">
            <h2>Archives</h2>
            <p className="subtitle">Browse all blog posts by publication date</p>
          </div>
          <div className="loading-spinner">Loading archives...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="archives-page">
        <div className="component-box">
          <div className="component-header">
            <h2>Archives</h2>
            <p className="subtitle">Browse all blog posts by publication date</p>
          </div>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  const groupedArchives = groupByYear();
  const sortedYears = getSortedYears(groupedArchives);

  return (
    <div className="archives-page">
      <div className="component-box">
        <div className="component-header">
          <h2>Archives</h2>
          <p className="subtitle">Browse all blog posts by publication date</p>
        </div>

        {sortedYears.length === 0 ? (
          <div className="no-results">No archives available.</div>
        ) : (
          <div className="archives-content">
            {sortedYears.map(year => (
              <div key={year} className="archive-year-card">
                <div className="year-header">
                  <h3>{year}</h3>
                  <div className="year-divider"></div>
                </div>

                <div className="archive-months-grid">
                  {groupedArchives[year].map(archive => (
                    <Link
                      key={archive.month}
                      to={`/archives/${encodeURIComponent(archive.month)}`}
                      className="archive-month-card"
                    >
                      <div className="month-content">
                        <div className="month-name">
                          {archive.month.split(' ')[0]}
                        </div>
                        <div className="post-count">
                          <span className="count-number">{archive.count}</span>
                          <span className="count-label">Posts</span>
                        </div>
                      </div>
                      <div className="month-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14"></path>
                          <path d="M12 5l7 7-7 7"></path>
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivesPage;
