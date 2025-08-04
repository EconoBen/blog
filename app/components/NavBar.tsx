'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function NavBar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { href: '/', label: 'Posts' },
    { href: '/about', label: 'About' },
    { href: '/talks', label: 'Talks' },
    { href: '/publications', label: 'Publications' },
    { href: '/code-ai', label: 'Code & AI' },
    { href: '/archives', label: 'Archives' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <Link href="/" className="nav-brand">
          Economic Notes
        </Link>
        
        <div className="nav-items">
          {navItems.map((item) => (
            <div key={item.href} className="nav-item">
              <Link href={item.href}>
                {item.label}
              </Link>
              <span 
                className={`nav-highlight ${pathname === item.href ? 'visible' : ''}`}
              />
            </div>
          ))}
        </div>

        <form onSubmit={handleSearch} className="nav-search">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            🔍
          </button>
        </form>
      </div>
    </nav>
  );
}