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

const resultTypeOrder: SearchResult['type'][] = ['post', 'publication', 'talk', 'code-ai'];

const rowStyle = {
  paddingTop: '1rem',
  borderTop: '1px solid rgba(26, 36, 51, 0.12)',
  display: 'grid',
  gap: '0.75rem',
} as const;

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
  const typeLabels: Record<SearchResult['type'], string> = {
    post: 'Post',
    talk: 'Talk',
    publication: 'Publication',
    'code-ai': 'Code & tools',
  };

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
  const groupedResults = groupResultsByType(results);

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
      </section>

      <section className="editorial-list-section" style={{ maxWidth: '58rem', marginInline: 'auto' }}>
        <form onSubmit={handleSearch} className="search-input-container" role="search" aria-label="Site search">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts, talks, publications, and tools"
            className="search-input-large"
            autoFocus
          />
        </form>

        {!normalizedQuery ? (
          <div className="editorial-home-card">
            <p className="editorial-home-card-label">Try searching for</p>
            <div className="editorial-chip-row">
              {['memory', 'retrieval', 'economics', 'forecasting'].map((term) => (
                <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} className="editorial-chip">
                  {term}
                </Link>
              ))}
            </div>
            <div className="editorial-chip-row">
              <Link href="/posts" className="editorial-chip">Posts</Link>
              <Link href="/tags" className="editorial-chip">Tags</Link>
              <Link href="/archive" className="editorial-chip">Archive</Link>
            </div>
          </div>
        ) : loading ? (
          <div className="search-loading">
            <div className="loading-spinner"></div>
            <p>Searching...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="editorial-home-card">
            <p className="editorial-home-card-label">No results</p>
            <p className="editorial-post-summary">
              No results found for “{normalizedQuery}”. Try a broader keyword or search one of the suggested topics below.
            </p>
            <div className="editorial-chip-row">
              {['memory', 'llm', 'forecasting', 'tooling'].map((term) => (
                <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} className="editorial-chip">
                  {term}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <>
            <p className="results-count" aria-live="polite">
              Found {results.length} result{results.length !== 1 ? 's' : ''} for “{normalizedQuery}”
            </p>

            {groupedResults.map(({ type, results: typeResults }) => {
              return (
                <section key={type} className="editorial-list-section">
                  <div className="editorial-list-heading">
                    <p className="editorial-home-section-label">{typeLabels[type]}</p>
                    <h2 className="editorial-page-section-title">
                      {typeResults.length} result{typeResults.length !== 1 ? 's' : ''} in this section.
                    </h2>
                  </div>

                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {typeResults.map((result) => (
                      <article key={`${result.type}-${result.title}`} style={rowStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'baseline' }}>
                          <div>
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
                        <div className="editorial-chip-row">
                          {result.tags?.slice(0, 4).map((tag) => (
                            <span key={tag} className="editorial-chip">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Link href={result.url} className="editorial-post-link">
                          Open result
                        </Link>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
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
