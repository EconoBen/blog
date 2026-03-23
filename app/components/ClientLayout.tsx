'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import SocialLinks from './SocialLinks';
import DarkModeToggle from './DarkModeToggle';
import NavBar from './NavBar';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const editorialShellRoutes = [
  '/',
  '/book',
  '/code-ai',
  '/posts',
  '/publications',
  '/talks',
  '/about',
  '/search',
  '/tags',
  '/archive',
  '/archives',
];

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  // Default to open on desktop (production parity)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true; // Default to open for SSR
  });
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Load saved sidebar width from localStorage
    const savedWidth = localStorage.getItem('sidebarWidth');
    if (savedWidth) {
      setSidebarWidth(parseInt(savedWidth, 10));
    }

    // Load saved sidebar state, but default to open on desktop if no saved state
    const savedState = localStorage.getItem('sidebarOpen');
    const isDesktop = window.innerWidth >= 768;
    if (savedState !== null) {
      setSidebarOpen(savedState === 'true');
    } else if (isDesktop) {
      // Default to open on desktop if no saved preference
      setSidebarOpen(true);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const toggleSidebar = useCallback(() => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', String(newState));
  }, [sidebarOpen]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 400) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        localStorage.setItem('sidebarWidth', String(sidebarWidth));
      }
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, sidebarWidth]);

  const useEditorialShell = editorialShellRoutes.some((route) => {
    if (route === '/') {
      return pathname === route;
    }

    return pathname === route || pathname.startsWith(`${route}/`);
  });

  useEffect(() => {
    document.body.classList.toggle('shell-editorial', useEditorialShell);

    return () => {
      document.body.classList.remove('shell-editorial');
    };
  }, [useEditorialShell]);

  // Don't render sidebar on mobile
  if (isMobile || useEditorialShell) {
    return (
      <>
        {children}
        <DarkModeToggle />
      </>
    );
  }

  return (
    <>
      <Sidebar 
        width={sidebarWidth}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        isResizing={isResizing}
      />
      <div 
        className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}
        style={{ marginLeft: sidebarOpen ? `${sidebarWidth}px` : '0' }}
      >
        <NavBar />
        <div className="content-wrapper">
          {children}
        </div>
      </div>
      <SocialLinks />
      <DarkModeToggle />
      {/* Add resize handle event listener */}
      {sidebarOpen && (
        <div
          className="sidebar-resize-handle-overlay"
          onMouseDown={handleMouseDown}
          style={{
            position: 'fixed',
            top: 0,
            left: sidebarWidth - 5,
            width: '10px',
            height: '100%',
            cursor: 'ew-resize',
            zIndex: 1001,
          }}
        />
      )}
    </>
  );
};

export default ClientLayout;
