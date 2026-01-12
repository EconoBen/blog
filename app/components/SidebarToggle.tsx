'use client';

import { useSidebar } from '../hooks/useSidebar';

export const SidebarToggle: React.FC = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  
  return (
    <button 
      className="sidebar-toggle" 
      onClick={toggleSidebar}
      aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      aria-expanded={isOpen}
    >
      <div className="toggle-icon">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>
  );
};