'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface MobileNavbarProps {
  isVisible?: boolean;
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({ isVisible = true }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <nav className={`mobile-navbar ${isVisible ? 'visible' : 'hidden'}`}>
        <div className="mobile-navbar-top">
          <Link href="/" className="mobile-logo">
            <span className="logo-symbol">{'</>'}</span>
            <span>TechNotes</span>
          </Link>
          
          <button 
            className="mobile-search-button"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Open search"
          >
            <span>🔍</span>
            <span>Search</span>
          </button>
        </div>
      </nav>

      {searchOpen && (
        <div className="mobile-search-panel">
          <div className="mobile-search-container">
            <input
              type="search"
              placeholder="Search posts..."
              className="mobile-search-input"
              autoFocus
            />
            <button 
              className="mobile-search-close"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavbar;