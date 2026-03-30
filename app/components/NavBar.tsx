'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavBar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/posts', label: 'Posts' },
    { path: '/talks', label: 'Talks' },
    { path: '/publications', label: 'Publications' },
    { path: '/book', label: 'Book' },
    { path: '/about', label: 'About' },
  ];

  const isActive = (route: string): boolean => {
    if (route === '/' && pathname === '/') return true;
    if (route !== '/' && pathname.startsWith(route)) return true;
    return false;
  };

  return (
    <nav className="main-nav" role="navigation" aria-label="Main navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link href="/" className="logo-link">
            <span className="logo-text">Ben Labaschin</span>
          </Link>
        </div>

        <div className="nav-items">
          {navItems.map((item) => (
            <div key={item.path} className={`nav-item ${isActive(item.path) ? 'active' : ''}`}>
              <Link href={item.path} aria-current={isActive(item.path) ? 'page' : undefined}>
                {item.label}
              </Link>
            </div>
          ))}
        </div>

        <div className="nav-search">
          <Link href="/search" className="nav-search-link" aria-label="Search the site">
            <span className="nav-search-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 15L11.5 11.5M13 7C13 10.3137 10.3137 13 7 13C3.68629 13 1 10.3137 1 7C1 3.68629 3.68629 1 7 1C10.3137 1 13 3.68629 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>Search</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
