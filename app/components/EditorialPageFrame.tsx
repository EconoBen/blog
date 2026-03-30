import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';

const primaryNavItems = [
  { href: '/', label: 'Home' },
  { href: '/posts', label: 'Posts' },
  { href: '/talks', label: 'Talks' },
  { href: '/publications', label: 'Publications' },
  { href: '/book', label: 'Book' },
  { href: '/code-ai', label: 'Code & Tools' },
  { href: '/about', label: 'About' },
];

const discoveryNavItems = [
  { href: '/tags', label: 'Tags' },
  { href: '/search', label: 'Search' },
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

const prioritizeActiveItem = <T extends { href: string }>(items: T[], currentPath: string) => {
  const activeIndex = items.findIndex((item) => isActivePath(currentPath, item.href));

  if (activeIndex <= 0) {
    return items;
  }

  return [
    items[activeIndex],
    ...items.slice(0, activeIndex),
    ...items.slice(activeIndex + 1),
  ];
};

interface EditorialPageFrameProps {
  children: ReactNode;
  currentPath: string;
  pageClassName?: string;
}

const activeNavStyle: CSSProperties = {
  color: '#fef9ef',
  WebkitTextFillColor: '#fef9ef',
};

export function EditorialTopbar({ currentPath }: { currentPath: string }) {
  const compactShell = isCompactShell(currentPath);
  const mobilePrimaryNavItems = prioritizeActiveItem(primaryNavItems, currentPath);
  const mobileDiscoveryNavItems = prioritizeActiveItem(discoveryNavItems, currentPath);
  const brandLabel = compactShell ? 'econoben.dev' : 'ECONOBEN.DEV';
  const headerClassName = compactShell
    ? 'sticky top-0 z-50 w-full border-b border-[#1d1c16]/5 bg-[#fef9ef]/95 backdrop-blur'
    : 'sticky top-0 z-50 w-full border-b border-[#1d1c16]/5 bg-[#f8f3e9]/95 shadow-[0_24px_40px_rgba(29,28,22,0.04)] backdrop-blur';
  const brandClassName = compactShell
    ? 'font-headline text-xl font-bold tracking-tighter text-[#1d1c16] md:text-2xl'
    : 'font-headline text-xl font-black tracking-tighter text-[#1d1c16] md:text-2xl';
  const desktopNavItemClassName = (active: boolean) =>
    active
      ? 'inline-flex min-h-[34px] items-center justify-center rounded-full border border-[#004ac6]/15 bg-[#004ac6] px-3 py-2 text-[11px] font-bold uppercase leading-none tracking-[0.22em] whitespace-nowrap text-[#fef9ef] shadow-[0_8px_18px_rgba(0,74,198,0.18)]'
      : 'inline-flex min-h-[34px] items-center justify-center px-1 py-2 text-[11px] font-bold uppercase leading-none tracking-[0.22em] whitespace-nowrap text-[#555f70] transition-colors duration-200 hover:text-[#004ac6]';
  const mobileDiscoveryNavItemClassName = (active: boolean) =>
    active
      ? 'inline-flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.24em] text-[#004ac6]'
      : 'inline-flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.24em] text-[#555f70] transition-colors duration-200 hover:text-[#004ac6]';
  const mobileNavItemClassName = (active: boolean) =>
    active
      ? 'inline-flex min-h-[30px] items-center justify-center rounded-full border border-[#004ac6]/15 bg-[#004ac6] px-2.5 py-1 text-[10px] font-bold uppercase leading-none tracking-[0.2em] whitespace-nowrap text-[#fef9ef] shadow-[0_8px_18px_rgba(0,74,198,0.18)]'
      : 'inline-flex min-h-[30px] items-center justify-center rounded-full border border-[#1d1c16]/10 bg-[#f8f3e9]/90 px-2.5 py-1 text-[10px] font-bold uppercase leading-none tracking-[0.2em] whitespace-nowrap text-[#555f70] transition-colors duration-200 hover:border-[#004ac6]/30 hover:bg-[#004ac6]/10 hover:text-[#004ac6]';

  return (
    <header className={headerClassName}>
      <div className="mx-auto flex max-w-7xl flex-col gap-2.5 px-4 py-2.5 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-6 md:px-8 md:py-6">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className={brandClassName} aria-label="Go to home">
            {brandLabel}
          </Link>
          <nav className="flex items-center gap-3 md:hidden" aria-label="Discovery">
            {mobileDiscoveryNavItems.map((item) => {
              const active = isActivePath(currentPath, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={mobileDiscoveryNavItemClassName(active)}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <nav className="hidden flex-1 items-center justify-center gap-2 md:flex" aria-label="Primary">
          {primaryNavItems.map((item) => {
            const active = isActivePath(currentPath, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={desktopNavItemClassName(active)}
                style={active ? activeNavStyle : undefined}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <nav className="hidden items-center gap-2 md:flex" aria-label="Discovery">
          {discoveryNavItems.map((item) => {
            const active = isActivePath(currentPath, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={desktopNavItemClassName(active)}
                style={active ? activeNavStyle : undefined}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <nav
        className="mx-auto max-w-7xl px-4 pb-2 md:hidden sm:px-6"
        aria-label="Primary"
      >
        <div className="overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max gap-2 pr-4">
          {mobilePrimaryNavItems.map((item) => {
            const active = isActivePath(currentPath, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={mobileNavItemClassName(active)}
                style={active ? activeNavStyle : undefined}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          </div>
        </div>
      </nav>
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
    <div className={`min-h-screen overflow-x-hidden bg-[#fef9ef] text-[#1d1c16] ${pageClassName}`.trim()}>
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
