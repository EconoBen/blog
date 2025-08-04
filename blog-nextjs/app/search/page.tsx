'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SearchResult } from '../services/UnifiedSearchService';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const typeLabels: Record<string, string> = {
    post: 'Blog Post',
    talk: 'Talk',
    publication: 'Publication',
    archive: 'Archive',
    'code-ai': 'Code & AI'
  };

  const typeColors: Record<string, string> = {
    post: 'bg-blue-100 text-blue-800',
    talk: 'bg-green-100 text-green-800',
    publication: 'bg-purple-100 text-purple-800',
    archive: 'bg-gray-100 text-gray-800',
    'code-ai': 'bg-orange-100 text-orange-800'
  };

  return (
    <div className="search-results-page">
      <div className="page-header">
        <h1 className="page-title">Search Results</h1>
      </div>

      <form onSubmit={handleSearch} className="search-input-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search posts, talks, publications..."
          className="search-input-large"
          autoFocus
        />
      </form>

      {loading ? (
        <div className="search-loading">
          <div className="loading-spinner"></div>
          <p>Searching...</p>
        </div>
      ) : query && results.length === 0 ? (
        <div className="no-results">
          <p>No results found for "{query}"</p>
          <p className="text-sm text-gray-600 mt-2">
            Try different keywords or check your spelling
          </p>
        </div>
      ) : results.length > 0 ? (
        <div className="search-results-container">
          <p className="results-count">
            Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </p>
          
          {results.map((result) => (
            <Link 
              key={`${result.type}-${result.title}`}
              href={result.url}
              className="search-result-item"
            >
              <div className="search-result-content">
                
                <div className="search-result-details">
                  <span className={`search-result-type ${typeColors[result.type]}`}>
                    {typeLabels[result.type]}
                  </span>
                  
                  <h2 className="search-result-title">{result.title}</h2>
                  
                  <p className="search-result-description">
                    {result.description}
                  </p>
                  
                  <div className="search-result-meta">
                    {result.date && (
                      <time>
                        {new Date(result.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    )}
                    
                    {result.tags && result.tags.length > 0 && (
                      <div className="search-result-tags">
                        {result.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="tag-small">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}