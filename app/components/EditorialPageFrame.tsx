import type { ReactNode } from 'react';
import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/posts', label: 'Posts' },
  { href: '/talks', label: 'Talks' },
  { href: '/publications', label: 'Publications' },
  { href: '/book', label: 'Book' },
  { href: '/archive', label: 'Archive' },
  { href: '/search', label: 'Search' },
  { href: '/about', label: 'About' },
];

const isActivePath = (currentPath: string, href: string) => {
  if (href === '/') {
    return currentPath === href;
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
};

interface EditorialPageFrameProps {
  children: ReactNode;
  currentPath: string;
  pageClassName?: string;
}

export function EditorialTopbar({ currentPath }: { currentPath: string }) {
  return (
    <header className="editorial-home-topbar">
      <div className="editorial-home-brand">
        <Link href="/" className="editorial-home-brand-link" aria-label="Go to home">
          <p className="editorial-home-brand-name">BEN LABASCHIN</p>
        </Link>
        <p className="editorial-home-brand-note">AI systems, memory, and editorial writing</p>
      </div>
      <nav className="editorial-home-nav" aria-label="Primary">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`editorial-home-nav-link ${isActivePath(currentPath, item.href) ? 'is-active' : ''}`}
            aria-current={isActivePath(currentPath, item.href) ? 'page' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function EditorialPageFrame({
  children,
  currentPath,
  pageClassName = 'editorial-book-page',
}: EditorialPageFrameProps) {
  return (
    <div className={pageClassName}>
      <div className="editorial-home-shell">
        <EditorialTopbar currentPath={currentPath} />
        <main className="editorial-home-content">{children}</main>
      </div>
    </div>
  );
}
