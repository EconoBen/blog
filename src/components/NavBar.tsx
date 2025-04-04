import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Enhanced NavBar component with animations and interactive elements
 *
 * @returns {JSX.Element} The rendered NavBar component
 */
const NavBar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  const [scrolled, setScrolled] = useState(false);
  const [navHover, setNavHover] = useState<string | null>(null);

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

  return (
    <nav
      className={`main-nav ${scrolled ? 'nav-scrolled' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="logo-link">
            <span className="logo-symbol">&lt;/&gt;</span>
            <span className="logo-text">TechNotes</span>
          </Link>
        </div>

        <div className="nav-items">
          {[
            { path: '/about', label: 'About' },
            { path: '/', label: 'Posts' },
            { path: '/talks', label: 'Talks' },
            { path: '/publications', label: 'Publications' },
            { path: '/archives', label: 'Archive' },
          ].map(item => (
            <div
              key={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onMouseEnter={() => setNavHover(item.path)}
              onMouseLeave={() => setNavHover(null)}
            >
              <Link to={item.path}>
                {item.label}
                <div
                  className={`nav-highlight ${navHover === item.path || isActive(item.path) ? 'visible' : ''}`}
                  style={{ position: 'relative', bottom: '-1px' }}
                />
              </Link>
            </div>
          ))}
        </div>

        <div className="nav-search">
          <input
            type="text"
            placeholder="Search posts..."
            aria-label="Search posts"
            className="search-input"
          />
          <button className="search-button" aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
