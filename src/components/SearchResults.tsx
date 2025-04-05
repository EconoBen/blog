import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Post, postService } from '../services/PostService';
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
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>(query);
  const [autocompleteResults, setAutocompleteResults] = useState<Post[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);
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
      const foundPosts = await postService.searchPosts(searchQuery);
      setResults(foundPosts);
    } catch (error) {
      console.error('Error searching posts:', error);
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
      const foundPosts = await postService.searchPosts(value);
      setAutocompleteResults(foundPosts.slice(0, 5)); // Limit to top 5 matches
    } catch (error) {
      console.error('Error getting autocomplete results:', error);
      setAutocompleteResults([]);
    }
  }, []);

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
  const handleSelectResult = (slug: string) => {
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
   * Calculate estimated reading time based on content length
   *
   * @param {string} content - Post content
   * @returns {number} Estimated reading time in minutes
   */
  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  /**
   * Get excerpt from post content, preferring the summary field if available
   *
   * @param {string} content - Post content
   * @param {string} [summary] - Optional summary from frontmatter
   * @returns {string} Excerpt for display
   */
  const getExcerpt = (content: string, summary?: string): string => {
    // If a summary is provided in frontmatter, use it
    if (summary && summary.trim()) {
      return summary.length <= 150 ? summary : summary.substring(0, 147) + '...';
    }

    // Fallback to first paragraph if no summary is available
    const firstParagraph = content.split('\n\n')[0];
    if (firstParagraph.length <= 150) {
      return firstParagraph;
    }
    return firstParagraph.substring(0, 147) + '...';
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
            placeholder="Search posts..."
            className="search-input-large"
            autoFocus
          />

          {showAutocomplete && autocompleteResults.length > 0 && (
            <div ref={autocompleteRef} className="search-autocomplete">
              {autocompleteResults.map(post => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="autocomplete-item"
                  onClick={() => handleSelectResult(post.slug)}
                >
                  <div className="autocomplete-title">
                    {highlightMatch(post.title, inputValue)}
                  </div>
                  <div className="autocomplete-meta">
                    <span className="autocomplete-date">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="autocomplete-reading-time">
                      {calculateReadingTime(post.content)} min read
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

        <h1 className="page-title">
          {loading ? 'Searching...' : `Search Results for "${query}"`}
        </h1>

        {!loading && results.length === 0 && (
          <div className="no-results-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <p>No posts found matching "{query}"</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <p className="results-count">{results.length} {results.length === 1 ? 'post' : 'posts'} found</p>

            <div className="blog-cards-container">
              {results.map(post => (
                <BlogPostCard
                  key={post.slug}
                  slug={post.slug}
                  title={post.title}
                  date={post.date}
                  tags={post.tags}
                  excerpt={getExcerpt(post.content, post.summary)}
                  readingTime={calculateReadingTime(post.content)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
