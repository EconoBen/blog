import React, { useState, useEffect, useCallback, useRef } from 'react';
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
 * Enhanced NavBar component with animations and interactive elements
 * This is only used for desktop view, mobile uses BottomNav
 *
 * @returns {JSX.Element} The rendered NavBar component
 */
const NavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [scrolled, setScrolled] = useState(false);
  const [navHover, setNavHover] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [autocompleteResults, setAutocompleteResults] = useState<Post[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedAutocomplete = useCallback(
    debounce((value: string) => {
      updateAutocomplete(value);
    }, 150), // Faster debounce for autocomplete
    [updateAutocomplete]
  );

  /**
   * Checks if a route is active
   *
   * @param {string} route - Route to check
   * @returns {boolean} Whether the route is active
   */
  const isActive = (route: string): boolean => {
    if (route === '/' && path === '/') return true;
    if (route !== '/' && path.startsWith(route)) return true;
    return false;
  };

  /**
   * Handles the search input change
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Change event
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedAutocomplete(value);
    setShowAutocomplete(true);
  };

  /**
   * Handles the search form submission
   *
   * @param {React.FormEvent} e - Form event
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowAutocomplete(false);
    }
  };

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
   * Highlight matching text in a string
   *
   * @param {string} text - The text to highlight matches in
   * @param {string} search - The search term to highlight
   * @returns {JSX.Element | string} Text with highlighting markup
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

  /**
   * Get content type label based on post tags or slug
   *
   * @param {Post} post - The post object
   * @returns {string} Human-readable type label
   */
  const getContentTypeLabel = (post: Post): string => {
    // Check tags first
    if (post.tags.includes('talk')) return 'Talk';
    if (post.tags.includes('publication')) return 'Publication';

    // Check slug patterns
    if (post.slug.includes('talk') || post.slug.startsWith('talk-')) return 'Talk';
    if (post.slug.includes('publication') || post.slug.startsWith('pub-')) return 'Publication';

    // Default to Post
    return 'Post';
  };

  /**
   * Handles selecting a result from autocomplete
   *
   * @param {string} slug - The post slug
   */
  const handleSelectResult = (slug: string) => {
    setShowAutocomplete(false);
  };

  // Handle focus on input
  const handleInputFocus = () => {
    if (searchQuery.trim() && autocompleteResults.length > 0) {
      setShowAutocomplete(true);
    }
  };

  // Add scroll listener to create sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close autocomplete on click outside
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

  const navItems = [
    { path: '/', label: 'Posts' },
    { path: '/talks', label: 'Talks' },
    { path: '/publications', label: 'Publications' },
    { path: '/archives', label: 'Archive' },
    { path: '/about', label: 'About' },
  ];

  return (
    <nav
      className={`main-nav ${scrolled ? 'nav-scrolled' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="nav-container">
        {/* Logo/Brand - Always visible */}
        <div className="nav-brand">
          <Link to="/" className="logo-link">
            <span className="logo-symbol">&lt;/&gt;</span>
            <span className="logo-text">TechNotes</span>
          </Link>
        </div>

        {/* Desktop Navigation Items */}
        <div className="nav-items">
          {navItems.map(item => (
            <div
              key={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onMouseEnter={() => setNavHover(item.path)}
              onMouseLeave={() => setNavHover(null)}
            >
              <Link
                to={item.path}
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                {item.label}
                <div
                  className={`nav-highlight ${navHover === item.path || isActive(item.path) ? 'visible' : ''}`}
                  style={{ position: 'relative', bottom: '-1px' }}
                />
              </Link>
            </div>
          ))}
        </div>

        {/* Desktop Search */}
        <div className="nav-search desktop-search">
          <form onSubmit={handleSearch}>
            <div className="search-container">
              <input
                ref={inputRef}
                placeholder="Search posts..."
                aria-label="Search posts"
                className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleInputFocus}
              />
              <button
                type="submit"
                className="search-icon"
                aria-label="Submit search"
              >
                {/* Magnifying glass icon removed */}
              </button>
            </div>

            {showAutocomplete && autocompleteResults.length > 0 && (
              <div className="autocomplete-dropdown" ref={autocompleteRef}>
                {autocompleteResults.map(post => (
                  <Link
                    key={post.slug}
                    to={`/posts/${post.slug}`}
                    onClick={() => handleSelectResult(post.slug)}
                    className="autocomplete-item"
                  >
                    <div className="autocomplete-type">{getContentTypeLabel(post)}</div>
                    <div className="autocomplete-title">
                      {highlightMatch(post.title, searchQuery)}
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
                  to={`/search?q=${encodeURIComponent(searchQuery)}`}
                  className="autocomplete-view-all"
                  onClick={() => setShowAutocomplete(false)}
                >
                  View all results
                </Link>
              </div>
            )}
          </form>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
