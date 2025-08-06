'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BottomNavProps {
  isVisible?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ isVisible = true }) => {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      label: 'Posts',
      icon: '📝',
      isActive: pathname === '/'
    },
    {
      href: '/code-ai',
      label: 'Code & AI',
      icon: '💻',
      isActive: pathname.startsWith('/code-ai')
    },
    {
      href: '/talks',
      label: 'Talks',
      icon: '🎤',
      isActive: pathname.startsWith('/talks')
    },
    {
      href: '/publications',
      label: 'Publications',
      icon: '📚',
      isActive: pathname.startsWith('/publications')
    },
    {
      href: '/about',
      label: 'About',
      icon: '👨‍💼',
      isActive: pathname.startsWith('/about')
    }
  ];

  return (
    <nav className={`bottom-nav ${isVisible ? 'visible' : 'hidden'}`}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`bottom-nav-item ${item.isActive ? 'active' : ''}`}
        >
          <div className="bottom-nav-icon">{item.icon}</div>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNav;