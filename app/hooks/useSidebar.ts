'use client';

import { useState, useCallback, useEffect } from 'react';

export const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Default to closed (production parity)
  
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
    // Initialize based on screen size - sidebar closed by default on all screens (production parity)
    const shouldOpen = false; // Always start closed to match production
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