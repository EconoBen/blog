import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useLocation, Link } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import NavBar from './components/NavBar';
import MobileNavBar from './components/MobileNavBar';
import PostDetail from './components/PostDetail';
import TagPage from './components/TagPage';
import ArchivePage from './components/ArchivePage';
import About from './components/About';
import TalksPage from './components/TalksPage';
import ArchivesPage from './components/ArchivesPage';
import HomePage from './components/HomePage';
import SocialLinks from './components/SocialLinks';
import PublicationsPage from './components/PublicationsPage';
import SearchResults from './components/SearchResults';

/**
 * Wrapper for PostDetail with route params
 *
 * @returns {JSX.Element} The rendered PostDetailWrapper component
 */
const PostDetailWrapper: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  return slug ? <PostDetail slug={slug} /> : <div>Post not found</div>;
};

/**
 * Wrapper for TagPage with route params
 *
 * @returns {JSX.Element} The rendered TagPageWrapper component
 */
const TagPageWrapper: React.FC = () => {
  const { tag } = useParams<{ tag: string }>();
  return tag ? <TagPage tag={tag} /> : <div>Tag not found</div>;
};

/**
 * Wrapper for ArchivePage with route params
 *
 * @returns {JSX.Element} The rendered ArchivePageWrapper component
 */
const ArchivePageWrapper: React.FC = () => {
  const { month } = useParams<{ month: string }>();
  return month ? <ArchivePage month={decodeURIComponent(month)} /> : <div>Archive not found</div>;
};

/**
 * Checks if the current device is a mobile device
 *
 * @returns {boolean} True if the device is mobile
 */
const isMobileDevice = (): boolean => {
  return window.innerWidth <= 768;
};

/**
 * Bottom navigation bar component for mobile devices
 *
 * @returns {JSX.Element} The bottom navigation bar
 */
const BottomNav: React.FC = () => {
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
    <div className="bottom-nav">
      <Link to="/" className={`bottom-nav-item ${isActive('/') && !path.startsWith('/posts/') ? 'active' : ''}`}>
        <div className="bottom-nav-icon">📝</div>
        <div>Posts</div>
      </Link>
      <Link to="/talks" className={`bottom-nav-item ${isActive('/talks') ? 'active' : ''}`}>
        <div className="bottom-nav-icon">🎤</div>
        <div>Talks</div>
      </Link>
      <Link to="/publications" className={`bottom-nav-item ${isActive('/publications') ? 'active' : ''}`}>
        <div className="bottom-nav-icon">📚</div>
        <div>Publications</div>
      </Link>
      <Link to="/archives" className={`bottom-nav-item ${isActive('/archives') ? 'active' : ''}`}>
        <div className="bottom-nav-icon">🗓️</div>
        <div>Archive</div>
      </Link>
      <Link to="/about" className={`bottom-nav-item ${isActive('/about') ? 'active' : ''}`}>
        <div className="bottom-nav-icon">👤</div>
        <div>About</div>
      </Link>
    </div>
  );
};

/**
 * Main App component for the blog application
 *
 * @returns {JSX.Element} The rendered App component
 */
const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(!isMobileDevice());
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [sidebarWidth, setSidebarWidth] = useState<number>(240);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(isMobileDevice());
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);

    // Check for saved sidebar width preference
    const savedWidth = localStorage.getItem('sidebarWidth');
    if (savedWidth) {
      setSidebarWidth(parseInt(savedWidth));
    }

    // Add window resize listener for mobile detection
    const handleResize = () => {
      const mobile = isMobileDevice();
      setIsMobile(mobile);

      // Auto close sidebar on mobile
      if (mobile) {
        setIsSidebarOpen(false);
      } else if (!mobile && !isSidebarOpen) {
        // Auto-open sidebar when switching back to desktop
        setIsSidebarOpen(true);
      }
    };

    // Set up online/offline detection
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    // Prevent double tap zoom on mobile devices
    const preventDoubleTapZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Track scroll position for toggle button animations
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('scroll', handleScroll);

    // Add touch event listeners for mobile
    if (isMobile) {
      document.addEventListener('touchstart', preventDoubleTapZoom, { passive: false });

      // Fix for iOS Safari 100vh issue
      const setViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };

      setViewportHeight();
      window.addEventListener('resize', setViewportHeight);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('scroll', handleScroll);

      if (isMobile) {
        document.removeEventListener('touchstart', preventDoubleTapZoom);
        // Use an anonymous function to avoid the scope issue with setViewportHeight
        window.removeEventListener('resize', () => {
          const vh = window.innerHeight * 0.01;
          document.documentElement.style.setProperty('--vh', `${vh}px`);
        });
      }
    };
  }, [isSidebarOpen, isMobile]);

  // Update body classes based on sidebar, dark mode, and offline state
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }

    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    if (isOffline) {
      document.body.classList.add('offline');
    } else {
      document.body.classList.remove('offline');
    }

    if (isMobile) {
      document.body.classList.add('mobile-view');
    } else {
      document.body.classList.remove('mobile-view');
    }

    // Update CSS variable to match current sidebar width
    document.body.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
  }, [isSidebarOpen, isDarkMode, sidebarWidth, isOffline, isMobile]);

  /**
   * Handles the start of resizing the sidebar
   *
   * @param {React.MouseEvent} e - The mouse event
   */
  const handleResizeStart = (e: React.MouseEvent): void => {
    if (isMobile) return; // Prevent resizing on mobile
    setIsResizing(true);
    e.preventDefault();
  };

  /**
   * Handles the mouse movement while resizing
   *
   * @param {MouseEvent} e - The mouse event
   */
  const handleResizeMove = useCallback((e: MouseEvent): void => {
    if (!isResizing || isMobile) return;

    // Get window width to calculate max sidebar width
    const windowWidth = window.innerWidth;
    const maxWidth = Math.min(500, windowWidth * 0.4); // 40% of window width or 500px, whichever is smaller

    // Set minimum and maximum width constraints
    const newWidth = Math.max(180, Math.min(maxWidth, e.clientX));
    setSidebarWidth(newWidth);
    document.body.style.setProperty('--sidebar-width', `${newWidth}px`);
  }, [isResizing, setSidebarWidth, isMobile]);

  /**
   * Handles the end of resizing the sidebar
   */
  const handleResizeEnd = useCallback((): void => {
    setIsResizing(false);
    // Save the current width to localStorage using the computed style
    const currentWidth = getComputedStyle(document.body).getPropertyValue('--sidebar-width');
    localStorage.setItem('sidebarWidth', currentWidth.replace('px', ''));
  }, []);

  // Add and remove event listeners for resize functionality
  useEffect(() => {
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);

    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [handleResizeMove, handleResizeEnd]);

  /**
   * Toggles the sidebar open/closed state
   */
  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);

    // If opening sidebar on mobile, remove mobile menu if it's open
    if (isMobile && !isSidebarOpen && document.body.classList.contains('mobile-menu-open')) {
      document.body.classList.remove('mobile-menu-open');
    }
  };

  /**
   * Toggles the dark mode on/off
   */
  const toggleDarkMode = (): void => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  /**
   * Determine if the sidebar toggle button should be visible
   * Shows after scrolling down a bit, or if sidebar is open
   */
  const isSidebarToggleVisible = (): boolean => {
    return scrollPosition > 100 || isSidebarOpen;
  };

  return (
    <Router>
      <div className={`blog-container ${isMobile ? 'mobile-container' : ''}`}>
        {/* Sidebar Toggle Button - Only visible on desktop */}
        {!isMobile && (
          <div
            className={`sidebar-toggle ${isSidebarToggleVisible() ? 'visible' : ''}`}
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            role="button"
            tabIndex={0}
          >
            <div className={`toggle-icon ${isSidebarOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        {/* Dark Mode Toggle - Position differs for mobile/desktop */}
        <div
          className={`dark-mode-toggle ${isMobile ? 'mobile-dark-mode-toggle' : ''}`}
          onClick={toggleDarkMode}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          role="button"
          tabIndex={0}
        >
          <div className="dark-mode-icon"></div>
        </div>

        {/* Social Links - Only on desktop */}
        {!isMobile && <SocialLinks />}

        {/* Sidebar Component - Only shown on desktop */}
        {!isMobile && <Sidebar width={sidebarWidth} />}

        {/* Sidebar Resize Handle - Only on desktop with open sidebar */}
        {isSidebarOpen && !isMobile && (
          <div
            className="sidebar-resize-handle"
            onMouseDown={handleResizeStart}
          />
        )}

        {/* Main Content Component */}
        <div className="main-content" style={{
          marginLeft: isMobile ? '0' : (isSidebarOpen ? `${sidebarWidth}px` : '0'),
          maxWidth: isMobile ? '100%' : (isSidebarOpen ? `calc(100% - ${sidebarWidth}px)` : '100%'),
          width: '100%'
        }}>
          {/* Navigation Bar - Desktop or Mobile */}
          {isMobile ? <MobileNavBar /> : <NavBar />}

          {/* Routes */}
          <div className={`content-wrapper ${isMobile ? 'mobile-content-wrapper' : ''}`}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/posts/:slug" element={<PostDetailWrapper />} />
              <Route path="/tags/:tag" element={<TagPageWrapper />} />
              <Route path="/archives/:month" element={<ArchivePageWrapper />} />
              <Route path="/archives" element={<ArchivesPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/talks" element={<TalksPage />} />
              <Route path="/publications" element={<PublicationsPage />} />
              <Route path="/search" element={<SearchResults />} />
            </Routes>
          </div>

          {/* Bottom Navigation - Only on mobile */}
          {isMobile && <BottomNav />}
        </div>
      </div>
    </Router>
  );
};

export default App;
