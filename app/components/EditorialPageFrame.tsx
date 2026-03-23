import type { ReactNode } from 'react';
import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/posts', label: 'Posts' },
  { href: '/talks', label: 'Talks' },
  { href: '/publications', label: 'Publications' },
  { href: '/book', label: 'Book' },
  { href: '/code-ai', label: 'Code & Tools' },
  { href: '/about', label: 'About' },
];

const footerLinks = [
  { href: '/archive', label: 'Archive' },
  { href: '/code-ai', label: 'Code & Tools' },
  { href: '/tags', label: 'Tags' },
  { href: '/about', label: 'CV' },
  { href: 'mailto:benjaminlabaschindev@gmail.com', label: 'Contact' },
];

const isActivePath = (currentPath: string, href: string) => {
  if (href === '/') {
    return currentPath === href;
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
};

const isCompactShell = (currentPath: string) => (
  currentPath === '/' || currentPath === '/posts' || currentPath === '/talks'
);

interface EditorialPageFrameProps {
  children: ReactNode;
  currentPath: string;
  pageClassName?: string;
}

export function EditorialTopbar({ currentPath }: { currentPath: string }) {
  const compactShell = isCompactShell(currentPath);
  const brandLabel = compactShell ? 'econoben.dev' : 'ECONOBEN.DEV';
  const headerClassName = compactShell
    ? 'sticky top-0 z-50 w-full border-b border-transparent bg-[#fef9ef]/95 backdrop-blur'
    : 'sticky top-0 z-50 w-full bg-[#f8f3e9] shadow-[0_24px_40px_rgba(29,28,22,0.04)]';
  const brandClassName = compactShell
    ? 'font-headline text-2xl font-bold tracking-tighter text-[#1d1c16]'
    : 'font-headline text-2xl font-black tracking-tighter text-[#1d1c16]';
  const navClassName = compactShell
    ? 'hidden md:flex items-center gap-8 font-label text-xs font-bold uppercase tracking-widest'
    : 'hidden md:flex items-center gap-8 font-headline text-sm font-medium tracking-tight';

  return (
    <header className={headerClassName}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <Link href="/" className={brandClassName} aria-label="Go to home">
          {brandLabel}
        </Link>
        <nav className={navClassName} aria-label="Primary">
          {navItems.map((item) => {
            const active = isActivePath(currentPath, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={active
                  ? 'border-b-2 border-[#004ac6] pb-1 text-[#004ac6]'
                  : 'pb-1 text-[#555f70] transition-colors duration-200 hover:text-[#004ac6]'}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/search"
          className={compactShell
            ? 'font-label text-xs font-bold uppercase tracking-widest text-[#555f70] transition-colors duration-200 hover:text-[#004ac6]'
            : 'text-[#555f70] transition-colors duration-200 hover:text-[#004ac6]'}
        >
          Search
        </Link>
      </div>
    </header>
  );
}

export function EditorialPageFrame({
  children,
  currentPath,
  pageClassName = 'editorial-book-page',
}: EditorialPageFrameProps) {
  const copyrightYear = new Date().getFullYear();

  return (
    <div className={`min-h-screen bg-[#fef9ef] text-[#1d1c16] ${pageClassName}`.trim()}>
      <div>
        <EditorialTopbar currentPath={currentPath} />
        <main>{children}</main>
        <footer className="mt-20 w-full border-t border-[#1d1c16]/10 bg-[#f8f3e9]">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-8 py-12 md:flex-row">
            <div className="font-headline text-sm uppercase tracking-wide text-[#555f70]">
              {copyrightYear > 2024 ? `© 2024-${copyrightYear} Ben` : '© 2024 Ben'} - Technical Curator &amp; Economist
            </div>
            <nav className="flex flex-wrap justify-center gap-8">
              {footerLinks.map((item) => {
                const isInternal = item.href.startsWith('/');
                const isHttpLink = item.href.startsWith('http://') || item.href.startsWith('https://');
                const linkClassName =
                  'font-headline text-sm uppercase tracking-wide text-[#555f70] opacity-80 transition-opacity hover:opacity-100 hover:underline';

                if (!isInternal) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={linkClassName}
                      {...(isHttpLink ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {item.label}
                    </a>
                  );
                }

                return (
                  <Link key={item.href} href={item.href} className={linkClassName}>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}
