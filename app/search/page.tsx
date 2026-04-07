'use client';

import type { FormEvent } from 'react';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import type { SearchResult } from '../services/UnifiedSearchService';

function formatResultDate(date?: Date) {
  if (!date) return null;

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    setSearchQuery(query);

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

    if (query) {
      void performSearch(query);
      return;
    }

    setResults([]);
  }, [query]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextQuery = searchQuery.trim();
    if (!nextQuery) {
      router.replace('/search');
      return;
    }

    router.replace(`/search?q=${encodeURIComponent(nextQuery)}`);
  };

  const typeLabels: Record<string, string> = {
    post: 'Blog post',
    talk: 'Talk',
    publication: 'Publication',
    archive: 'Archive',
    'code-ai': 'Code & tools',
  };

  return (
    <EditorialPageFrame currentPath="/search" pageClassName="editorial-book-page">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">Search</p>
          <h1 className="editorial-page-title">Search Results</h1>
          <p className="editorial-page-copy">
            Search posts, talks, publications, and code notes without leaving the editorial index.
          </p>
        </div>
        <aside className="editorial-page-aside">
          <p className="editorial-home-card-label">Search status</p>
          <div className="editorial-page-metric-list">
            <div>
              <span className="editorial-page-metric-value">{results.length}</span>
              <span className="editorial-page-metric-label">results on the current query</span>
            </div>
            <div>
              <Link href="/archive" className="editorial-post-link">
                Browse archive
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <section className="editorial-list-section">
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

        {!query ? (
          <div className="editorial-page-aside">
            <p className="editorial-home-card-label">Try searching for</p>
            <div className="editorial-chip-row">
              {['memory', 'retrieval', 'economics', 'forecasting'].map((term) => (
                <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} className="editorial-chip">
                  {term}
                </Link>
              ))}
            </div>
          </div>
        ) : loading ? (
          <div className="search-loading">
            <div className="loading-spinner"></div>
            <p>Searching...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="no-results">
            <p>No results found for "{query}"</p>
            <p className="text-sm text-gray-600 mt-2">
              Try different keywords or check your spelling
            </p>
          </div>
        ) : (
          <>
            <p className="results-count">
              Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </p>

            <div className="editorial-post-grid">
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.title}`}
                  href={result.url}
                  className="editorial-post-card search-result-item"
                >
                  <div className="editorial-post-meta">
                    <span>{typeLabels[result.type]}</span>
                    {formatResultDate(result.date) && <span>{formatResultDate(result.date)}</span>}
                  </div>

                  <h2>{result.title}</h2>

                  {result.description && <p className="editorial-post-summary">{result.description}</p>}

                  <div className="editorial-chip-row">
                    {result.tags?.slice(0, 3).map((tag) => (
                      <span key={tag} className="editorial-chip">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="editorial-post-link">Open result</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </EditorialPageFrame>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
