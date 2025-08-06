'use client';

import React, { useEffect, useState } from 'react';

const DarkModeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved dark mode preference or default to light theme (production parity)
    const savedDarkMode = localStorage.getItem('darkMode');
    
    // Default to light theme (false) unless explicitly saved as dark mode
    const initialDarkMode = savedDarkMode === 'true';
    setIsDarkMode(initialDarkMode);
    
    if (initialDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      // Ensure light theme is properly set
      document.body.classList.remove('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    localStorage.setItem('darkMode', String(newDarkMode));
  };

  return (
    <div
      className="dark-mode-toggle"
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      role="button"
      tabIndex={0}
    >
      <div className="dark-mode-icon"></div>
    </div>
  );
};

export default DarkModeToggle;