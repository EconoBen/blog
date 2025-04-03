import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * NavBar component for the blog
 *
 * @returns {JSX.Element} The rendered NavBar component
 */
const NavBar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

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

  return (
    <div className="main-nav">
      <div className={`main-nav-item ${isActive('/about') ? 'active' : ''}`}>
        <Link to="/about">About</Link>
      </div>
      <div className={`main-nav-item ${isActive('/posts') || path === '/' ? 'active' : ''}`}>
        <Link to="/">Posts</Link>
      </div>
      <div className={`main-nav-item ${isActive('/talks') ? 'active' : ''}`}>
        <Link to="/talks">Talks</Link>
      </div>
      <div className={`main-nav-item ${isActive('/archives') ? 'active' : ''}`}>
        <Link to="/archives">Archive</Link>
      </div>
      <div className={`main-nav-item ${isActive('/reading-list') ? 'active' : ''}`}>
        <Link to="/reading-list">Reading List</Link>
      </div>

    </div>
  );
};

export default NavBar;
