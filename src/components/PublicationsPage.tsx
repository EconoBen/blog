import React, { useState, useMemo } from 'react';
import { Publication } from '../types';
import PublicationCard from './PublicationCard';
import { publicationsConfig } from '../config/publicationsConfig';

/**
 * Props for the PublicationsPage component
 */
interface PublicationsPageProps {
  /** Optional filter to show publications of a specific type */
  initialFilter?: string;
}

/**
 * PublicationsPage component displays academic publications
 *
 * @param {PublicationsPageProps} props - Component properties
 * @returns {JSX.Element} The rendered PublicationsPage component
 */
const PublicationsPage: React.FC<PublicationsPageProps> = ({ initialFilter }) => {
  const [filter, setFilter] = useState<string>(initialFilter || 'all');

  // Get unique publication types for filtering
  const publicationTypes = useMemo(() => {
    const types = new Set<string>();
    publicationsConfig.publications.forEach(pub => types.add(pub.type));
    return ['all', ...Array.from(types)];
  }, []);

  // Filter publications based on selected type
  const filteredPublications = useMemo(() => {
    if (filter === 'all') {
      return publicationsConfig.publications;
    }
    return publicationsConfig.publications.filter(pub => pub.type.toLowerCase() === filter.toLowerCase());
  }, [filter]);

  return (
    <div className="publications-page">
      <div className="component-box">
        <div className="component-header">
          <h2>{filter === 'all' ? publicationsConfig.title : `${filter.charAt(0).toUpperCase() + filter.slice(1)}s`}</h2>
          <p className="subtitle">{publicationsConfig.subtitle}</p>

          <div className="filter-controls">
            {publicationTypes.map(type => (
              <button
                key={type}
                className={`filter-button ${filter === type ? 'active' : ''}`}
                onClick={() => setFilter(type)}
              >
                {type === 'all' ? 'All Publications' : `${type.charAt(0).toUpperCase() + type.slice(1)}s`}
              </button>
            ))}
          </div>
        </div>

        <div className="publications-list">
          {filteredPublications.length > 0 ? (
            filteredPublications.map(publication => (
              <PublicationCard key={publication.id} publication={publication} />
            ))
          ) : (
            <p className="no-results">No publications found for the selected filter.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicationsPage;
