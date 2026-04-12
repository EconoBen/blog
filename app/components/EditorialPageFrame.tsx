import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { ScrollToTop } from './ScrollToTop';
import { StickyContactRemote } from './StickyContactRemote';
import { SubscribeForm } from './SubscribeForm';

const primaryNavItems = [
  { href: '/', label: 'Home' },
  { href: '/posts', label: 'Posts' },
  { href: '/talks', label: 'Talks' },
  { href: '/publications', label: 'Publications' },
  { href: '/book', label: 'New Book' },
  { href: '/code-ai', label: 'Code & Tools' },
  { href: '/about', label: 'About' },
];

const discoveryNavItems = [
  { href: '/tags', label: 'Tags' },
  { href: '/search', label: 'Search' },
];

const footerLinks = [
  { href: '/archive', label: 'Archive' },
  { href: '/tags', label: 'Tags' },
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

const activeMobileNavStyle: CSSProperties = {
  color: '#fef9ef',
  WebkitTextFillColor: '#fef9ef',
};

export function EditorialTopbar({ currentPath }: { currentPath: string }) {
  const compactShell = isCompactShell(currentPath);
  const mobilePrimaryNavItems = prioritizeActiveItem(primaryNavItems, currentPath);
  const mobileDiscoveryNavItems = prioritizeActiveItem(discoveryNavItems, currentPath);
  const brandLabel = 'ECONOBEN.DEV';
  const headerClassName = compactShell
    ? 'fixed top-0 left-0 z-50 w-full border-b border-[#1d1c16]/8 bg-[#fef9ef]/96 backdrop-blur'
    : 'fixed top-0 left-0 z-50 w-full border-b border-[#1d1c16]/8 bg-[#f8f3e9]/96 shadow-[0_20px_36px_rgba(29,28,22,0.04)] backdrop-blur';
  const brandClassName = 'font-headline text-[1.7rem] font-black tracking-tight text-[#1d1c16] transition-all duration-200 hover:text-[#0035a0] hover:-translate-y-0.5';
  const desktopNavItemClassName = (active: boolean) =>
    active
      ? 'inline-flex min-h-[40px] items-center justify-center px-3 py-2 rounded-t-lg rounded-b-none bg-[#0035a0] font-headline text-sm font-bold uppercase leading-none tracking-[0.12em] whitespace-nowrap !text-white [&]:text-white'
      : 'inline-flex min-h-[40px] items-center justify-center px-3 py-2 font-headline text-sm font-bold uppercase leading-none tracking-[0.12em] whitespace-nowrap text-[#555f70] transition-all duration-200 hover:text-[#0035a0] hover:-translate-y-0.5';
  const mobileNavItemClassName = (active: boolean) =>
    active
      ? 'inline-flex min-h-[32px] items-center justify-center rounded-full border border-[#0035a0]/15 bg-[#0035a0] px-2.5 py-1 text-[9px] font-bold uppercase leading-none tracking-[0.22em] whitespace-nowrap text-[#fef9ef] shadow-[0_8px_18px_rgba(0,74,198,0.18)]'
      : 'inline-flex min-h-[32px] items-center justify-center rounded-full border border-[#1d1c16]/10 bg-[#f8f3e9]/90 px-2.5 py-1 text-[9px] font-bold uppercase leading-none tracking-[0.22em] whitespace-nowrap text-[#555f70] transition-colors duration-200 hover:border-[#0035a0]/30 hover:bg-[#0035a0]/10 hover:text-[#0035a0]';

  return (
    <header className={headerClassName}>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2.5 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-8 md:px-8 md:py-5">
        <div className="flex items-center gap-3">
          <Link href="/" className={brandClassName} aria-label="Go to home">
            {brandLabel}
          </Link>
        </div>
        <nav className="hidden flex-1 items-center justify-center gap-2 md:flex" aria-label="Primary">
          {primaryNavItems.map((item) => {
            const active = isActivePath(currentPath, item.href);
            const isBook = item.href === '/book';

            return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${desktopNavItemClassName(active)}${isBook && !active ? ' nav-shine' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
              </Link>
            );
          })}
        </nav>
        <nav className="hidden items-center gap-3 md:flex" aria-label="Discovery">
          {discoveryNavItems.map((item) => {
            const active = isActivePath(currentPath, item.href);

            return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active
                    ? 'inline-flex items-center justify-center px-2 py-1 font-label text-[10px] font-semibold uppercase leading-none tracking-[0.18em] whitespace-nowrap text-[#555f70]'
                    : 'flex items-center justify-center px-2 py-1 font-label text-[10px] font-semibold uppercase leading-none tracking-[0.18em] whitespace-nowrap text-[#999] transition-all duration-200 hover:text-[#555f70] hover:-translate-y-0.5'
                  }
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <nav
        className="mx-auto max-w-[1440px] px-4 pb-2.5 md:hidden sm:px-6"
        aria-label="Primary"
      >
        <div className="flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {primaryNavItems.map((item) => {
            const active = isActivePath(currentPath, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={mobileNavItemClassName(active)}
                style={active ? activeMobileNavStyle : undefined}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
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
    <div className={`bg-[#fef9ef] min-h-screen text-[#1d1c16] ${pageClassName}`.trim()}>
      <div>
        <EditorialTopbar currentPath={currentPath} />
        <div className="h-[100px] md:h-[80px]" aria-hidden="true" />
        <main className="lg:pr-20 xl:pr-24">{children}</main>
        <ScrollToTop />
        <StickyContactRemote />
        <section id="subscribe" className="banner-glow bg-[#e8eef8] py-16 sm:py-20">
          <div className="mx-auto max-w-[1440px] px-8">
            <SubscribeForm variant="light" />
          </div>
        </section>
        <footer className="w-full border-t border-[#1d1c16]/10 bg-[#f8f3e9]">
          <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-5 py-4 md:flex-row md:gap-4 md:px-8 md:py-5">
            <div className="font-headline text-xs uppercase tracking-wide text-[#1d1c16]" suppressHydrationWarning>
              {copyrightYear > 2024 ? `© 2024-${copyrightYear}` : '© 2024'} Ben Labaschin
            </div>
            <nav className="flex flex-wrap justify-center gap-4 md:gap-5">
              {footerLinks.map((item) => {
                const isInternal = item.href.startsWith('/');
                const isHttpLink = item.href.startsWith('http://') || item.href.startsWith('https://');
                const linkClassName =
                  'font-headline text-xs uppercase tracking-wide text-[#1d1c16] opacity-80 transition-all hover:opacity-100 hover:underline hover:-translate-y-0.5';

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
