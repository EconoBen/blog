import React, { useState, useCallback, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Post, postService } from '../services/PostService';

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
 * MobileNavBar component that provides navigation for mobile devices
 *
 * @returns {JSX.Element} The rendered MobileNavBar component
 */
const MobileNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchVisible, setSearchVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);

  /**
   * Toggle search panel visibility
   */
  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    // Clear search if closing
    if (searchVisible) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  /**
   * Handle search input changes
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  /**
   * Search posts with the current query
   *
   * @param {string} query - The search query
   */
  const searchPosts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await postService.searchPosts(query);
      setSearchResults(results.slice(0, 3)); // Limit to 3 results for mobile
    } catch (error) {
      console.error('Error searching posts:', error);
    }
  }, []);

  // Debounce search to avoid excessive API calls
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => searchPosts(query), 300),
    [searchPosts]
  );

  // Update search results when query changes
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  // Close search when location changes (user navigates)
  useEffect(() => {
    setSearchVisible(false);
  }, [location]);

  /**
   * Handle search form submission
   *
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchVisible(false);
    }
  };

  return (
    <div className="mobile-navbar">
      <div className="mobile-navbar-top">
        <Link to="/" className="mobile-logo">
          <span className="logo-symbol">&lt;/&gt;</span>
          <span className="mobile-logo-text">TechNotes</span>
        </Link>

        <button
          className="mobile-search-button"
          onClick={toggleSearch}
          aria-label="Toggle search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span>Search</span>
        </button>
      </div>

      {/* Mobile Search Panel */}
      {searchVisible && (
        <div className="mobile-search-panel">
          <form onSubmit={handleSubmit}>
            <div className="mobile-search-container">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={handleSearchChange}
                autoFocus
                className="mobile-search-input"
                aria-label="Search"
              />
              <button type="button" onClick={toggleSearch} className="mobile-search-close" aria-label="Close search">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </form>

          {/* Quick Results */}
          {searchResults.length > 0 && (
            <div className="mobile-search-results">
              {searchResults.map(post => (
                <Link
                  key={post.slug}
                  to={`/posts/${post.slug}`}
                  className="mobile-search-result"
                  onClick={() => setSearchVisible(false)}
                >
                  <span className="mobile-result-title">{post.title}</span>
                </Link>
              ))}

              <Link
                to={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                className="mobile-view-all-results"
                onClick={() => setSearchVisible(false)}
              >
                View all results
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileNavBar;
