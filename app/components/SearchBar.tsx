'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'post' | 'talk' | 'publication' | 'archive';
  url: string;
  date: string;
  tags?: string[];
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=5`);
      const data = await response.json();
      setResults(data.results || []);
      setShowDropdown(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowDropdown(false);
    }
  };

  const handleFocus = () => {
    if (query.trim() && results.length > 0) {
      setShowDropdown(true);
    }
  };

  const typeLabels = {
    post: 'Post',
    talk: 'Talk',
    publication: 'Publication',
    archive: 'Archive'
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          placeholder="Search posts, talks, publications..."
          className="search-input"
          aria-label="Search"
        />
        <button type="submit" className="search-button" aria-label="Search">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
        </button>
      </form>

      {showDropdown && (results.length > 0 || loading) && (
        <div ref={dropdownRef} className="search-dropdown">
          {loading ? (
            <div className="search-loading">Searching...</div>
          ) : (
            <>
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={result.url}
                  className="search-dropdown-item"
                  onClick={() => {
                    setShowDropdown(false);
                    setQuery('');
                  }}
                >
                  <span className="search-item-type">{typeLabels[result.type]}</span>
                  <div className="search-item-content">
                    <h4 className="search-item-title">{result.title}</h4>
                    {result.description && (
                      <p className="search-item-description">{result.description}</p>
                    )}
                  </div>
                </Link>
              ))}
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                className="search-view-all"
                onClick={() => {
                  setShowDropdown(false);
                }}
              >
                View all results →
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}