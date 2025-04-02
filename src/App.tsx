import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import NavBar from './components/NavBar';
import PostDetail from './components/PostDetail';
import TagPage from './components/TagPage';
import ArchivePage from './components/ArchivePage';
import About from './components/About';
import ReadingList from './components/ReadingList';
import FavoriteTalks from './components/FavoriteTalks';
import ArchivesPage from './components/ArchivesPage';
import { postService } from './services/PostService';

/**
 * Home page component
 *
 * @returns {JSX.Element} The rendered Home component
 */
const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const loadDockerPost = async () => {
      try {
        console.log("Attempting to load Docker post...");
        const dockerPost = await postService.getPostBySlug('optimizing-docker-build-pipelines');

        if (dockerPost) {
          console.log("Successfully loaded Docker post:", dockerPost.title);
          setPost(dockerPost);
        } else {
          console.error("Docker post not found");
          setPost(null);
        }
      } catch (error) {
        console.error("Failed to load post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    loadDockerPost();
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return <div>Loading post...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <>
      <div className="blog-header">
        <h1 className="blog-title">{post.title}</h1>
        <div className="blog-meta">
          {formatDate(post.date)}
          {post.tags.map((tag: string) => (
            <span key={tag} className="blog-tag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
    </>
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

  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
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
  }, [isSidebarOpen, isDarkMode]);

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

        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content Component */}
        <div className="main-content">
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
              <Route path="/reading-list" element={<ReadingList />} />
              <Route path="/favorite-talks" element={<FavoriteTalks />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
