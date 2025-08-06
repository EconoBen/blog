'use client';

import { useState, useMemo } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { gistItems, gistCategories, WorkshopItem } from '../config/workshopGists';
import { sortOptions, viewOptions, ITEMS_PER_PAGE } from '../config/workshopConfig';

// Since we're using client-side features, we can't use export const metadata
// Instead, we'll use generateMetadata in a layout or make this a server component with client components

export default function CodeAIPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Sort items by date (most recent first)
  const sortedItems = useMemo(() => {
    return [...gistItems].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA; // Most recent first
    });
  }, []);

  // Filter items based on category and search
  const filteredItems = useMemo(() => {
    return sortedItems.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  }, [sortedItems, selectedCategory, searchQuery]);

  // Get unique categories with counts
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    sortedItems.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    
    return gistCategories.map(cat => ({
      ...cat,
      count: counts[cat.id] || 0
    }));
  }, [sortedItems]);

  const totalCount = sortedItems.length;

  return (
    <div className="code-ai-page">
      <div className="page-header">
        <h1 className="page-title">Code & AI</h1>
        <p className="page-subtitle">
          Practical code snippets, ML/AI insights, and productivity tools
        </p>
      </div>

      <div className="code-ai-controls">
        <div className="code-ai-filters">
          <button
            className={`filter-button ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All ({totalCount})
          </button>
          {categoriesWithCounts.map(cat => (
            <button
              key={cat.id}
              className={`filter-button ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.icon} {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        <div className="code-ai-search-and-view">
          <input
            type="text"
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="code-ai-search"
          />
          
          <div className="view-mode-toggle">
            <button
              className={`view-mode-button ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="1" width="6" height="6" />
                <rect x="9" y="1" width="6" height="6" />
                <rect x="1" y="9" width="6" height="6" />
                <rect x="9" y="9" width="6" height="6" />
              </svg>
            </button>
            <button
              className={`view-mode-button ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="2" width="14" height="2" />
                <rect x="1" y="7" width="14" height="2" />
                <rect x="1" y="12" width="14" height="2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="no-results">
          <p>No snippets found matching your criteria.</p>
        </div>
      ) : (
        <div className={`code-ai-items ${viewMode}`}>
          {filteredItems.map((item) => (
            <CodeAICard key={item.id} item={item} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  );
}

function CodeAICard({ item, viewMode }: { item: WorkshopItem; viewMode: 'grid' | 'list' }) {
  const categoryConfig = gistCategories.find(cat => cat.id === item.category);
  
  return (
    <article className={`code-ai-card ${viewMode}`}>
      <div className="code-ai-card-header">
        <div className="code-ai-meta">
          <span className="code-ai-category">
            {categoryConfig?.icon} {categoryConfig?.name || item.category}
          </span>
          <time className="code-ai-date">
            {item.date ? new Date(item.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }) : 'No date'}
          </time>
        </div>
        <h3 className="code-ai-title">{item.title}</h3>
      </div>

      <p className="code-ai-description">{item.description}</p>

      <div className="code-ai-tags">
        {item.tags.map((tag: string) => (
          <span key={tag} className="code-ai-tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="code-ai-footer">
        {item.gistUrl && (
          <a 
            href={item.gistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="code-ai-link"
          >
            View on GitHub →
          </a>
        )}
        <Link 
          href={`/code-ai/${item.id}`}
          className="code-ai-link primary"
        >
          View Details →
        </Link>
      </div>
    </article>
  );
}