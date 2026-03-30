'use client';

import type { FormEvent } from 'react';
import { Suspense, useEffect, useMemo, useState } from 'react';
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

const resultTypeOrder: SearchResult['type'][] = ['post', 'publication', 'talk', 'code-ai'];
const filterOptions: Array<'all' | SearchResult['type']> = ['all', 'post', 'publication', 'talk', 'code-ai'];
const typeLabels: Record<SearchResult['type'], string> = {
  post: 'Post',
  talk: 'Talk',
  publication: 'Publication',
  'code-ai': 'Code & tools',
};

const groupResultsByType = (results: SearchResult[]) => {
  const groups = new Map<SearchResult['type'], SearchResult[]>();

  results.forEach((result) => {
    const typeResults = groups.get(result.type) ?? [];
    typeResults.push(result);
    groups.set(result.type, typeResults);
  });

  return resultTypeOrder
    .filter((type) => groups.has(type))
    .map((type) => ({
      type,
      results: groups.get(type) ?? [],
    }));
};

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const normalizedQuery = query.trim();

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);
  const [activeType, setActiveType] = useState<'all' | SearchResult['type']>('all');

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

  const visibleResults = useMemo(
    () => (activeType === 'all' ? results : results.filter((result) => result.type === activeType)),
    [activeType, results]
  );
  const groupedResults = useMemo(() => groupResultsByType(visibleResults), [visibleResults]);
  const typeCounts = useMemo(() => {
    const counts = new Map<SearchResult['type'], number>();
    results.forEach((result) => {
      counts.set(result.type, (counts.get(result.type) ?? 0) + 1);
    });
    return counts;
  }, [results]);
  const topResults = useMemo(() => visibleResults.slice(0, 3), [visibleResults]);
  const suggestions = normalizedQuery
    ? [normalizedQuery, 'memory', 'retrieval', 'analysis']
    : ['memory', 'retrieval', 'economics', 'forecasting'];

  return (
    <EditorialPageFrame currentPath="/search" pageClassName="editorial-book-page">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy" style={{ maxWidth: '46rem' }}>
          <p className="editorial-home-kicker">Search</p>
          <h1 className="editorial-page-title">Search</h1>
          <p className="editorial-page-copy">
            Search posts, talks, publications, and code notes without leaving the site. Results stay grouped so the page stays readable as the corpus grows.
          </p>
          <p className="editorial-post-summary" aria-live="polite">
            {normalizedQuery ? `Showing results for “${normalizedQuery}”.` : 'Search the archive by topic, title, or theme.'}
          </p>
          <div className="editorial-breadcrumb" aria-label="Search navigation">
            <Link href="/posts">Posts</Link>
            <span>/</span>
            <Link href="/tags">Topics</Link>
            <span>/</span>
            <span>Search</span>
          </div>
          <div className="editorial-link-row" style={{ marginTop: '0.5rem' }}>
            <Link href="/posts" className="editorial-post-link">
              Posts
            </Link>
            <Link href="/tags" className="editorial-post-link">
              Tags
            </Link>
            <Link href="/archive" className="editorial-post-link">
              Archive
            </Link>
          </div>
        </div>
        <aside className="editorial-page-aside">
          <p className="editorial-home-card-label">Search state</p>
          <div className="editorial-page-metric-list" style={{ marginTop: '12px' }}>
            <div>
              <span className="editorial-page-metric-value">{results.length}</span>
              <span className="editorial-page-metric-label">Total matches for this query</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">{visibleResults.length}</span>
              <span className="editorial-page-metric-label">Visible after applying filters</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">{activeType === 'all' ? 'All' : typeLabels[activeType]}</span>
              <span className="editorial-page-metric-label">Active result filter</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="editorial-search-layout">
        <div className="editorial-search-main">
          <form onSubmit={handleSearch} className="editorial-search-sidebar-card" role="search" aria-label="Site search">
            <p className="editorial-home-card-label">Search across all content</p>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts, talks, publications, and tools"
              className="editorial-search-field"
              autoFocus
            />
            <div className="editorial-search-filters" style={{ marginTop: '16px' }}>
              {filterOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`editorial-filter-chip ${activeType === type ? 'is-active' : ''}`}
                  onClick={() => setActiveType(type)}
                >
                  {type === 'all' ? 'All' : typeLabels[type]}
                </button>
              ))}
              <button
                type="button"
                className="editorial-filter-chip is-muted"
                onClick={() => setActiveType('all')}
              >
                Clear filters
              </button>
            </div>
          </form>

          {!normalizedQuery ? (
            <div className="editorial-search-results">
              <div className="editorial-search-sidebar-card">
                <p className="editorial-home-card-label">Try searching for</p>
                <div className="editorial-chip-row">
                  {suggestions.map((term) => (
                    <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} className="editorial-chip">
                      {term}
                    </Link>
                  ))}
                </div>
                <div className="editorial-link-row">
                  <Link href="/posts" className="editorial-post-link">
                    Posts
                  </Link>
                  <Link href="/tags" className="editorial-post-link">
                    Tags
                  </Link>
                  <Link href="/archive" className="editorial-post-link">
                    Archive
                  </Link>
                </div>
              </div>
            </div>
          ) : loading ? (
            <div className="editorial-search-sidebar-card">
              <div className="search-loading">
                <div className="loading-spinner"></div>
                <p>Searching...</p>
              </div>
            </div>
          ) : visibleResults.length === 0 ? (
            <div className="editorial-search-sidebar-card">
              <p className="editorial-home-card-label">No results</p>
              <p className="editorial-post-summary">
                No results found for “{normalizedQuery}”. Try a broader keyword, clear the type filter, or search one of the suggested topics below.
              </p>
              <div className="editorial-chip-row">
                {suggestions.map((term) => (
                  <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} className="editorial-chip">
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="editorial-search-results">
              <p className="results-count" aria-live="polite">
                Found {visibleResults.length} result{visibleResults.length !== 1 ? 's' : ''} for “{normalizedQuery}”
              </p>

              {groupedResults.map(({ type, results: typeResults }) => (
                <section key={type} className="editorial-list-section" style={{ marginBottom: 0 }}>
                  <div className="editorial-list-heading">
                    <p className="editorial-home-section-label">{typeLabels[type]}</p>
                    <h2 className="editorial-page-section-title">
                      {typeResults.length} result{typeResults.length !== 1 ? 's' : ''} in this section.
                    </h2>
                  </div>

                  <div style={{ display: 'grid', gap: '14px' }}>
                    {typeResults.map((result) => (
                      <article key={`${result.type}-${result.title}`} className="editorial-post-row">
                        <div className="editorial-post-row-header">
                          <div className="editorial-post-row-title">
                            <p className="editorial-home-card-label">{typeLabels[result.type]}</p>
                            <h3 style={{ margin: 0 }}>
                              <Link href={result.url}>{result.title}</Link>
                            </h3>
                          </div>
                          <span className="editorial-post-summary">
                            {result.date ? formatResultDate(result.date) ?? typeLabels[result.type] : typeLabels[result.type]}
                          </span>
                        </div>
                        {result.description && <p className="editorial-post-summary">{result.description}</p>}
                        <div className="editorial-post-row-meta">
                          <span>{typeLabels[result.type]}</span>
                          {result.tags?.slice(0, 2).map((tag) => (
                            <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`}>
                              {tag}
                            </Link>
                          ))}
                        </div>
                        <Link href={result.url} className="editorial-post-link">
                          Open result
                        </Link>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        <aside className="editorial-search-sidebar">
          <div className="editorial-search-sidebar-card">
            <p className="editorial-home-card-label">Search map</p>
            <h3 style={{ marginTop: '8px' }}>Results by type</h3>
            <div className="editorial-page-metric-list" style={{ marginTop: '14px' }}>
              {resultTypeOrder.map((type) => (
                <div key={type}>
                  <span className="editorial-page-metric-value">{typeCounts.get(type) ?? 0}</span>
                  <span className="editorial-page-metric-label">{typeLabels[type]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="editorial-search-sidebar-card">
            <p className="editorial-home-card-label">Top matches</p>
            <h3 style={{ marginTop: '8px' }}>The first few results stay visible here.</h3>
            <div style={{ display: 'grid', gap: '12px', marginTop: '14px' }}>
              {topResults.length > 0 ? (
                topResults.map((result) => (
                  <article key={`${result.type}-${result.title}`} className="editorial-search-sidebar-card" style={{ padding: '14px 16px' }}>
                    <p className="editorial-home-card-label">{typeLabels[result.type]}</p>
                    <h3 style={{ marginTop: '6px', fontSize: '1rem' }}>
                      <Link href={result.url}>{result.title}</Link>
                    </h3>
                    {result.description && <p style={{ marginTop: '8px' }}>{result.description}</p>}
                  </article>
                ))
              ) : (
                <p>Search a topic to surface the strongest matches here.</p>
              )}
            </div>
          </div>

          <div className="editorial-search-sidebar-card">
            <p className="editorial-home-card-label">Suggested searches</p>
            <div className="editorial-chip-row">
              {suggestions.map((term) => (
                <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} className="editorial-chip">
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </aside>
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
