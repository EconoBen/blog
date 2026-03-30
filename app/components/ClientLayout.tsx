'use client';

import React, { useState, useEffect } from 'react';
import SocialLinks from './SocialLinks';
import DarkModeToggle from './DarkModeToggle';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <>
      {children}
      <SocialLinks />
      <DarkModeToggle />
    </>
  );
};

export default ClientLayout;