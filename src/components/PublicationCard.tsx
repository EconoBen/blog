import React, { useState } from 'react';
import { Publication } from '../types';

/**
 * Props for the PublicationCard component
 */
interface PublicationCardProps {
  /** Publication data */
  publication: Publication;
}

/**
 * PublicationCard component displays a publication with details and links
 *
 * @param {PublicationCardProps} props - Component properties
 * @returns {JSX.Element} The rendered PublicationCard component
 */
const PublicationCard: React.FC<PublicationCardProps> = ({ publication }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCitation, setShowCitation] = useState(false);

  /**
   * Format date for display
   *
   * @param {string} dateStr - ISO date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  /**
   * Get publication type badge class
   *
   * @returns {string} CSS class for badge
   */
  const getTypeBadgeClass = (): string => {
    switch(publication.type.toLowerCase()) {
      case 'book':
        return 'type-badge-book';
      case 'journal':
        return 'type-badge-journal';
      case 'conference':
        return 'type-badge-conference';
      case 'workshop':
        return 'type-badge-workshop';
      case 'report':
        return 'type-badge-report';
      default:
        return 'type-badge-other';
    }
  };

  /**
   * Truncate abstract for display
   *
   * @returns {string} Truncated abstract
   */
  const getTruncatedAbstract = (): string => {
    if (publication.abstract.length <= 200 || isExpanded) {
      return publication.abstract;
    }
    return publication.abstract.substring(0, 197) + '...';
  };

  /**
   * Toggle the expanded state
   */
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  /**
   * Toggle citation display
   */
  const toggleCitation = () => {
    setShowCitation(!showCitation);
  };

  return (
    <div className={`publication-card ${publication.featured ? 'publication-featured' : ''}`}>
      <div className="publication-card-content">
        <div className="publication-header">
          {publication.coverImage && (
            <div className="publication-cover">
              <img src={publication.coverImage} alt={publication.title} />
            </div>
          )}

          <div className="publication-meta">
            <div className="publication-type-and-date">
              <span className={`publication-type ${getTypeBadgeClass()}`}>
                {publication.type}
              </span>
              <span className="publication-date">
                {formatDate(publication.date)}
              </span>
              {publication.citations && (
                <span className="publication-citations">
                  {publication.citations} citations
                </span>
              )}
            </div>

            <h3 className="publication-title">
              {publication.url ? (
                <a href={publication.url} target="_blank" rel="noopener noreferrer">
                  {publication.title}
                </a>
              ) : (
                publication.title
              )}
            </h3>

            <p className="publication-authors">{publication.authors}</p>
            <p className="publication-venue">{publication.venue}</p>
          </div>
        </div>

        <div className="publication-body">
          <p className="publication-abstract">{getTruncatedAbstract()}</p>
          {publication.abstract.length > 200 && (
            <button
              className="abstract-toggle"
              onClick={toggleExpand}
            >
              {isExpanded ? 'Show Less' : 'Read More'}
            </button>
          )}
        </div>

        <div className="publication-footer">
          <div className="publication-topics">
            {publication.topics.map((topic, index) => (
              <span key={index} className="publication-topic-tag">{topic}</span>
            ))}
          </div>

          <div className="publication-actions">
            {publication.pdfUrl && (
              <a
                href={publication.pdfUrl}
                className="publication-action-button pdf-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
                PDF
              </a>
            )}

            {publication.doi && (
              <a
                href={`https://doi.org/${publication.doi}`}
                className="publication-action-button doi-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                DOI
              </a>
            )}

            {publication.bibtex && (
              <button
                className="publication-action-button cite-button"
                onClick={toggleCitation}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9h12"></path>
                  <path d="M6 15h12"></path>
                  <path d="M6 21h6"></path>
                </svg>
                Cite
              </button>
            )}
          </div>
        </div>

        {showCitation && publication.bibtex && (
          <div className="publication-citation">
            <h4>BibTeX Citation</h4>
            <pre className="bibtex-code">{publication.bibtex}</pre>
            <button
              className="copy-button"
              onClick={() => {
                if (publication.bibtex) {
                  navigator.clipboard.writeText(publication.bibtex);
                  // Optionally add feedback for successful copy
                }
              }}
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicationCard;
