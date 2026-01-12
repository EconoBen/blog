'use client';

import { useState, useCallback, useEffect } from 'react';

export const useSidebar = () => {
  // Default to open on desktop, closed on mobile (production parity)
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 768;
    }
    return true; // Default to open for SSR
  });
  
  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => {
      const newState = !prev;
      // Use sidebar-open class to match production
      document.body.classList.toggle('sidebar-open', newState);
      return newState;
    });
  }, []);
  
  const openSidebar = useCallback(() => {
    setIsOpen(true);
    document.body.classList.add('sidebar-open');
  }, []);
  
  const closeSidebar = useCallback(() => {
    setIsOpen(false);
    document.body.classList.remove('sidebar-open');
  }, []);
  
  useEffect(() => {
    // Initialize based on screen size - open on desktop, closed on mobile (production parity)
    const shouldOpen = window.innerWidth > 768;
    setIsOpen(shouldOpen);
    document.body.classList.toggle('sidebar-open', shouldOpen);
  }, []);

  useEffect(() => {
    // Handle resize events - keep sidebar closed on mobile, allow toggle on desktop
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        // Always close sidebar on mobile
        setIsOpen(false);
        document.body.classList.remove('sidebar-open');
      }
      // Don't auto-open on desktop - let user control it
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Persist state in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebar-state');
      if (savedState !== null) {
        const isOpenFromStorage = JSON.parse(savedState);
        setIsOpen(isOpenFromStorage);
        document.body.classList.toggle('sidebar-open', isOpenFromStorage);
      }
    }
  }, []);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-state', JSON.stringify(isOpen));
    }
  }, [isOpen]);
  
  return { 
    isOpen, 
    toggleSidebar, 
    openSidebar, 
    closeSidebar 
  };
};