'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems = [
    { path: '/posts', label: 'Posts' },
    { path: '/code-ai', label: 'Code & Tools' },
    { path: '/talks', label: 'Talks' },
    { path: '/publications', label: 'Publications' },
    { path: '/tags', label: 'Tags' },
    { path: '/archive', label: 'Archive' },
    { path: '/about', label: 'About' },
  ];

  return (
    <>
      {/* Hamburger button */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle mobile menu"
        aria-expanded={isOpen}
      >
        <span className="hamburger-box">
          <span className={`hamburger-inner ${isOpen ? 'active' : ''}`}></span>
        </span>
      </button>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`}>
        <nav className="mobile-menu-nav">
          <div className="mobile-menu-header">
            <Link href="/" className="mobile-menu-logo" onClick={() => setIsOpen(false)}>
              Economic Notes
            </Link>
          </div>
          
          <ul className="mobile-menu-items">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.path);
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`mobile-menu-link ${isActive ? 'active' : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mobile-menu-footer">
            <Link 
              href="/search" 
              className="mobile-search-link"
              onClick={() => setIsOpen(false)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              Search
            </Link>
          </div>
        </nav>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="mobile-menu-backdrop" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}