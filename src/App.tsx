import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Link } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import NavBar from './components/NavBar';
import PostDetail from './components/PostDetail';
import TagPage from './components/TagPage';
import ArchivePage from './components/ArchivePage';
import About from './components/About';
import ReadingList from './components/ReadingList';
import Talks from './components/Talks';
import ArchivesPage from './components/ArchivesPage';
import { postService } from './services/PostService';
import SocialLinks from './components/SocialLinks';

/**
 * Home page component
 *
 * @returns {JSX.Element} The rendered Home component
 */
const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        console.log("Loading all posts...");
        const allPosts = await postService.getAllPosts();

        if (allPosts && allPosts.length > 0) {
          console.log(`Successfully loaded ${allPosts.length} posts`);
          setPosts(allPosts);
        } else {
          console.error("No posts found");
          setPosts([]);
        }
      } catch (error) {
        console.error("Failed to load posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (!posts || posts.length === 0) {
    return <div>No posts found</div>;
  }

  return (
    <div className="posts-list">
      <h1 className="page-title">All Posts</h1>
      {posts.map(post => (
        <div key={post.slug} className="post-item">
          <h2 className="post-title">
            <Link to={`/posts/${post.slug}`}>{post.title}</Link>
          </h2>
          <div className="post-meta">
            {formatDate(post.date)}
            {post.tags.map((tag: string) => (
              <span key={tag} className="post-tag">{tag}</span>
            ))}
          </div>
          <div className="post-excerpt">
            {post.content.substring(0, 200)}...
          </div>
          <div className="post-read-more">
            <Link to={`/posts/${post.slug}`}>Read more →</Link>
          </div>
        </div>
      ))}
    </div>
  );
};

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
 * Main App component for the blog application
 *
 * @returns {JSX.Element} The rendered App component
 */
const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [sidebarWidth, setSidebarWidth] = useState<number>(240);
  const [isResizing, setIsResizing] = useState<boolean>(false);

  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);

    // Check for saved sidebar width preference
    const savedWidth = localStorage.getItem('sidebarWidth');
    if (savedWidth) {
      setSidebarWidth(parseInt(savedWidth));
    }
  }, []);

  // Update body classes based on sidebar and dark mode state
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

    // Update CSS variable to match current sidebar width
    document.body.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
  }, [isSidebarOpen, isDarkMode, sidebarWidth]);

  /**
   * Handles the start of resizing the sidebar
   *
   * @param {React.MouseEvent} e - The mouse event
   */
  const handleResizeStart = (e: React.MouseEvent): void => {
    setIsResizing(true);
    e.preventDefault();
  };

  /**
   * Handles the mouse movement while resizing
   *
   * @param {MouseEvent} e - The mouse event
   */
  const handleResizeMove = useCallback((e: MouseEvent): void => {
    if (!isResizing) return;

    // Get window width to calculate max sidebar width
    const windowWidth = window.innerWidth;
    const maxWidth = Math.min(500, windowWidth * 0.4); // 40% of window width or 500px, whichever is smaller

    // Set minimum and maximum width constraints
    const newWidth = Math.max(180, Math.min(maxWidth, e.clientX));
    setSidebarWidth(newWidth);
    document.body.style.setProperty('--sidebar-width', `${newWidth}px`);
  }, [isResizing, setSidebarWidth]);

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
  };

  /**
   * Toggles the dark mode on/off
   */
  const toggleDarkMode = (): void => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  return (
    <Router>
      <div className="blog-container">
        {/* Sidebar Toggle Button */}
        <div className="sidebar-toggle" onClick={toggleSidebar}>
          <div className="toggle-icon">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div className="dark-mode-toggle" onClick={toggleDarkMode}>
          <div className="dark-mode-icon"></div>
        </div>

        {/* Social Links */}
        <SocialLinks />

        {/* Sidebar Component */}
        <Sidebar width={sidebarWidth} />

        {/* Sidebar Resize Handle */}
        {isSidebarOpen && (
          <div
            className="sidebar-resize-handle"
            onMouseDown={handleResizeStart}
          />
        )}

        {/* Main Content Component */}
        <div className="main-content" style={{
          marginLeft: isSidebarOpen ? `${sidebarWidth}px` : '0',
          maxWidth: isSidebarOpen ? `calc(100% - ${sidebarWidth}px)` : '100%'
        }}>
          {/* Navigation Bar */}
          <NavBar />

          {/* Routes */}
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/posts/:slug" element={<PostDetailWrapper />} />
              <Route path="/tags/:tag" element={<TagPageWrapper />} />
              <Route path="/archives/:month" element={<ArchivePageWrapper />} />
              <Route path="/archives" element={<ArchivesPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/talks" element={<Talks />} />
              <Route path="/reading-list" element={<ReadingList />} />

            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
