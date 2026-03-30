'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface MobileNavbarProps {
  isVisible?: boolean;
}

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/posts', label: 'Posts' },
  { href: '/talks', label: 'Talks' },
  { href: '/publications', label: 'Publications' },
  { href: '/book', label: 'Book' },
  { href: '/about', label: 'About' },
];

export const MobileNavbar: React.FC<MobileNavbarProps> = ({ isVisible = true }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <nav className={`mobile-navbar ${isVisible ? 'visible' : 'hidden'}`}>
        <div className="mobile-navbar-top">
          <Link href="/" className="mobile-logo">
            <span className="mobile-logo-title">Ben Labaschin</span>
            <span className="mobile-logo-note">AI / economics / tech</span>
          </Link>

          <div className="mobile-navbar-actions">
            <Link href="/search" className="mobile-search-button">
              Search
            </Link>
            <button
              className="mobile-search-button"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label={searchOpen ? 'Close navigation' : 'Open navigation'}
            >
              <span>{searchOpen ? 'Close' : 'Menu'}</span>
            </button>
          </div>
        </div>
      </nav>

      {searchOpen && (
        <div className="mobile-search-panel">
          <div className="mobile-search-container">
            <div className="mobile-nav-links" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="mobile-nav-link" onClick={() => setSearchOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mobile-search-actions">
              <Link href="/search" className="mobile-search-input" onClick={() => setSearchOpen(false)}>
                Search the site
              </Link>
              <button
                className="mobile-search-close"
                onClick={() => setSearchOpen(false)}
                aria-label="Close navigation"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavbar;
