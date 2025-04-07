import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { unifiedSearchService } from '../services/UnifiedSearchService';
import { SearchResult, ContentType } from '../types';
import BlogPostCard from './BlogCard';

/**
 * Debounce function to limit how often a function is called
 *
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce delay in milliseconds
 * @returns {Function} The debounced function
 */
const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;

  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * SearchResults component that displays search results
 *
 * @returns {JSX.Element} The rendered SearchResults component
 */
const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>(query);
  const [autocompleteResults, setAutocompleteResults] = useState<SearchResult[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<ContentType | 'all'>('all');
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Perform the search with the current query
   *
   * @param {string} searchQuery - The query to search for
   * @returns {Promise<void>}
   */
  const performSearch = useCallback(async (searchQuery: string) => {
    setLoading(true);
    try {
      const foundResults = await unifiedSearchService.search(searchQuery);
      setResults(foundResults);
    } catch (error) {
      console.error('Error searching content:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update autocomplete results as user types
   *
   * @param {string} value - The current input value
   * @returns {Promise<void>}
   */
  const updateAutocomplete = useCallback(async (value: string) => {
    if (!value.trim()) {
      setAutocompleteResults([]);
      return;
    }

    try {
      const foundResults = await unifiedSearchService.search(value);
      setAutocompleteResults(foundResults.slice(0, 5)); // Limit to top 5 matches
    } catch (error) {
      console.error('Error getting autocomplete results:', error);
      setAutocompleteResults([]);
    }
  }, []);

  // Filter results by content type
  const filteredResults = activeFilter === 'all'
    ? results
    : results.filter(result => result.type === activeFilter);

  // Debounced functions
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchParams({ q: value });
    }, 300),
    [setSearchParams]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedAutocomplete = useCallback(
    debounce((value: string) => {
      updateAutocomplete(value);
    }, 150), // Faster debounce for autocomplete
    [updateAutocomplete]
  );

  // Handle input changes with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedAutocomplete(value);
    debouncedSearch(value);
    setShowAutocomplete(true);
  };

  // Handle selecting a result from autocomplete
  const handleSelectResult = () => {
    setShowAutocomplete(false);
  };

  // Handle focus on input
  const handleInputFocus = () => {
    if (inputValue.trim() && autocompleteResults.length > 0) {
      setShowAutocomplete(true);
    }
  };

  // Effect to perform search when query changes
  useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);

  // Set input value when query changes (e.g. from browser navigation)
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  // Handle clicks outside the autocomplete dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * Render search result item based on content type
   *
   * @param {SearchResult} result - The search result to render
   * @returns {JSX.Element} Rendered search result item
   */
  const renderResultItem = (result: SearchResult) => {
    const dateStr = new Date(result.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    return (
      <div key={`${result.type}-${result.id}`} className="search-result-item">
        <Link to={result.url} className="search-result-link">
          <div className="search-result-content">
            {result.imageUrl && (
              <div className="search-result-image">
                <img src={result.imageUrl} alt={result.title} />
              </div>
            )}
            <div className="search-result-details">
              <div className="search-result-type">{getContentTypeLabel(result.type)}</div>
              <h3 className="search-result-title">{highlightMatch(result.title, query)}</h3>
              <p className="search-result-description">{highlightMatch(result.description, query)}</p>
              <div className="search-result-meta">
                <span className="search-result-date">{dateStr}</span>
                {result.type === 'post' && result.metadata?.readingTime && (
                  <span className="search-result-reading-time">
                    {result.metadata.readingTime} min read
                  </span>
                )}
                {result.type === 'talk' && (
                  <span className="search-result-event">{result.metadata?.event}</span>
                )}
                {result.type === 'publication' && (
                  <span className="search-result-venue">{result.metadata?.venue}</span>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  /**
   * Get a label for displaying content type
   *
   * @param {ContentType} type - Content type
   * @returns {string} Human-readable content type label
   */
  const getContentTypeLabel = (type: ContentType): string => {
    switch (type) {
      case 'post': return 'Blog Post';
      case 'talk': return 'Talk';
      case 'publication': return 'Publication';
      case 'archive': return 'Archive';
      default: return type;
    }
  };

  /**
   * Count the number of results by content type
   *
   * @returns {Record<string, number>} Count of results by type
   */
  const getResultCountByType = (): Record<string, number> => {
    const counts: Record<string, number> = { all: results.length };

    results.forEach(result => {
      counts[result.type] = (counts[result.type] || 0) + 1;
    });

    return counts;
  };

  /**
   * Highlight matching text in a string
   *
   * @param {string} text - The text to highlight matches in
   * @param {string} search - The search term to highlight
   * @returns {string} Text with highlighting markup
   */
  const highlightMatch = (text: string, search: string): React.ReactNode => {
    if (!search.trim()) return text;

    const parts = text.split(new RegExp(`(${search.trim()})`, 'gi'));

    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase()
            ? <mark key={i}>{part}</mark>
            : part
        )}
      </>
    );
  };

  // Generate result counts
  const resultCounts = getResultCountByType();

  return (
    <div className="search-results-page">
      <div className="content-wrapper">
        <div className="search-input-container">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="Search across all content..."
            className="search-input-large"
            autoFocus
          />

          {showAutocomplete && autocompleteResults.length > 0 && (
            <div ref={autocompleteRef} className="search-autocomplete">
              {autocompleteResults.map(result => (
                <Link
                  key={`${result.type}-${result.id}`}
                  to={result.url}
                  className="autocomplete-item"
                  onClick={handleSelectResult}
                >
                  <div className="autocomplete-type">{getContentTypeLabel(result.type)}</div>
                  <div className="autocomplete-title">
                    {highlightMatch(result.title, inputValue)}
                  </div>
                  <div className="autocomplete-meta">
                    <span className="autocomplete-date">
                      {new Date(result.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </Link>
              ))}
              <Link
                to={`/search?q=${encodeURIComponent(inputValue)}`}
                className="autocomplete-view-all"
                onClick={() => setShowAutocomplete(false)}
              >
                View all results
              </Link>
            </div>
          )}
        </div>

        {inputValue && !loading && (
          <div className="search-results-header">
            <h1 className="search-results-title">
              {results.length > 0
                ? `${results.length} results for "${query}"`
                : `No results found for "${query}"`
              }
            </h1>

            {results.length > 0 && (
              <div className="search-filters">
                <button
                  className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                  All ({resultCounts.all})
                </button>
                {Object.entries(resultCounts)
                  .filter(([type]) => type !== 'all')
                  .map(([type, count]) => (
                    <button
                      key={type}
                      className={`filter-button ${activeFilter === type ? 'active' : ''}`}
                      onClick={() => setActiveFilter(type as ContentType)}
                    >
                      {getContentTypeLabel(type as ContentType)} ({count})
                    </button>
                  ))
                }
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="search-loading">
            <div className="loading-spinner"></div>
            <div>Searching...</div>
          </div>
        ) : (
          <>
            {filteredResults.length > 0 ? (
              <div className="search-results-container">
                {filteredResults.map(result => renderResultItem(result))}
              </div>
            ) : (
              inputValue && (
                <div className="no-results">
                  <p>No results found for your search.</p>
                  <p>Try using different keywords or check your spelling.</p>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
