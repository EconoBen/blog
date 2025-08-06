'use client';

import React, { useEffect, useState } from 'react';
import MobileNavbar from './MobileNavbar';
import BottomNav from './BottomNav';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide navigation when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, lastScrollY]);

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="mobile-container">
      <MobileNavbar isVisible={navVisible} />
      
      <main className="mobile-main-content">
        <div className="page-container">
          {children}
        </div>
      </main>
      
      <BottomNav isVisible={navVisible} />
    </div>
  );
};

export default MobileLayout;