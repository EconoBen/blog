'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
}

const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;

  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const NavBar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [navHover, setNavHover] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [autocompleteResults, setAutocompleteResults] = useState<Post[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateAutocomplete = useCallback(async (value: string) => {
    if (!value.trim()) {
      setAutocompleteResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
      const data = await response.json();
      setAutocompleteResults(data.posts?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error getting autocomplete results:', error);
      setAutocompleteResults([]);
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedAutocomplete = useCallback(
    debounce((value: string) => {
      updateAutocomplete(value);
    }, 150),
    [updateAutocomplete]
  );

  const isActive = (route: string): boolean => {
    if (route === '/' && pathname === '/') return true;
    if (route !== '/' && pathname.startsWith(route)) return true;
    return false;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedAutocomplete(value);
    setShowAutocomplete(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowAutocomplete(false);
    }
  };

  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

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

  const getContentTypeLabel = (post: Post): string => {
    if (post.tags.includes('talk')) return 'Talk';
    if (post.tags.includes('publication')) return 'Publication';
    if (post.slug.includes('talk') || post.slug.startsWith('talk-')) return 'Talk';
    if (post.slug.includes('publication') || post.slug.startsWith('pub-')) return 'Publication';
    return 'Post';
  };

  const handleSelectResult = (slug: string) => {
    setShowAutocomplete(false);
  };

  const handleInputFocus = () => {
    if (searchQuery.trim() && autocompleteResults.length > 0) {
      setShowAutocomplete(true);
    }
  };

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
    { path: '/code-ai', label: 'Code & Tools' },
    { path: '/talks', label: 'Talks' },
    { path: '/publications', label: 'Publications' },
    { path: '/archive', label: 'Archive' },
    { path: '/about', label: 'About' },
  ];

  return (
    <nav
      className={`main-nav ${scrolled ? 'nav-scrolled' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="nav-container">
        <div className="nav-brand">
          <Link href="/" className="logo-link">
            <span className="logo-symbol">&lt;/&gt;</span>
            <span className="logo-text">TechNotes</span>
          </Link>
        </div>

        <div className="nav-items">
          {navItems.map(item => (
            <div
              key={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onMouseEnter={() => setNavHover(item.path)}
              onMouseLeave={() => setNavHover(null)}
            >
              <Link
                href={item.path}
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
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 15L11.5 11.5M13 7C13 10.3137 10.3137 13 7 13C3.68629 13 1 10.3137 1 7C1 3.68629 3.68629 1 7 1C10.3137 1 13 3.68629 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {showAutocomplete && autocompleteResults.length > 0 && (
              <div className="autocomplete-dropdown" ref={autocompleteRef}>
                {autocompleteResults.map(post => (
                  <Link
                    key={post.slug}
                    href={`/posts/${post.slug}`}
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
                  href={`/search?q=${encodeURIComponent(searchQuery)}`}
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