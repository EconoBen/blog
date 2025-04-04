import React, { useState } from 'react';
import TalkCard from './TalkCard';
import { talksConfig } from '../config/talksConfig';
import { Talk } from '../types';

/**
 * TalksPage component displays a collection of talks/presentations
 *
 * @returns {JSX.Element} The rendered TalksPage component
 */
const TalksPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const { title, subtitle, talks } = talksConfig;

  /**
   * Extract all unique topics from talks
   *
   * @returns {string[]} Array of unique topics
   */
  const getUniqueTopics = (): string[] => {
    const topics = new Set<string>();
    talks.forEach(talk => {
      talk.topics.forEach(topic => topics.add(topic));
    });
    return Array.from(topics).sort();
  };

  /**
   * Filter talks by topic
   *
   * @returns {Talk[]} Filtered talks
   */
  const getFilteredTalks = (): Talk[] => {
    if (activeFilter === 'all') {
      return talks;
    }
    return talks.filter(talk => talk.topics.includes(activeFilter));
  };

  /**
   * Handle filter change
   *
   * @param {string} filter - Topic to filter by
   */
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <div className="talks-page">
      <div className="section-header">
        <h1 className="section-title">{title}</h1>
        <div className="section-line"></div>
        <p className="section-subtitle">{subtitle}</p>
      </div>

      <div className="talks-controls">
        <div className="talks-filter">
          <button
            className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All Topics
          </button>
          {getUniqueTopics().map(topic => (
            <button
              key={topic}
              className={`filter-button ${activeFilter === topic ? 'active' : ''}`}
              onClick={() => handleFilterChange(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      <div className="talks-component-box">
        <div className="talks-component-header">
          <h2 className="talks-component-title">
            {activeFilter === 'all' ? 'All Talks' : `Talks about ${activeFilter}`}
          </h2>
          <div className="view-toggle">
            <button
              className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List View"
              title="List View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
            <button
              className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
              title="Grid View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
          </div>
        </div>

        <div className="talks-component-content">
          <div className={`talks-container ${viewMode === 'list' ? 'talks-list' : 'talks-grid'}`}>
            {getFilteredTalks().map(talk => (
              <TalkCard key={talk.id} talk={talk} viewMode={viewMode} />
            ))}
          </div>

          {getFilteredTalks().length === 0 && (
            <div className="no-talks-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p>No talks found with the selected topic.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TalksPage;
