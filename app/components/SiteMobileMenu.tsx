'use client';

import {useEffect, useRef, type KeyboardEvent} from 'react';
import Link from 'next/link';

type Item = {href: string; label: string};
const activePath = (path: string, href: string) => href === '/' ? path === href : path === href || path.startsWith(`${href}/`);

export function SiteMobileMenu({currentPath, items}: {currentPath: string; items: Item[]}) {
  const container = useRef<HTMLDivElement>(null);
  const disclosure = useRef<HTMLDetailsElement>(null);
  const trigger = useRef<HTMLElement>(null);
  const close = () => { if (disclosure.current) disclosure.current.open = false; };
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !container.current?.contains(event.target)) close();
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, []);
  useEffect(close, [currentPath]);
  const escape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && disclosure.current?.open) {
      event.preventDefault(); close(); trigger.current?.focus();
    }
  };
  return <div ref={container} className="site-mobile-navigation" onKeyDown={escape}>
    <nav className="site-mobile-shortcuts" aria-label="Primary">
      {[{href:'/posts',label:'Writing'}, {href:'/book',label:'Book'}, {href:'/search',label:'Search'}].map(item =>
        <Link key={item.href} href={item.href} className="field-nav-link" aria-current={activePath(currentPath,item.href) ? 'page' : undefined} onClick={close}>{item.label}</Link>
      )}
      <details ref={disclosure} className="site-menu">
        <summary ref={trigger}>Menu <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 5h10M3 11h10" stroke="currentColor" strokeWidth="1.3"/></svg></summary>
        <nav className="site-menu-panel" aria-label="All pages">
          {items.map(item => <Link key={item.href} href={item.href} aria-current={activePath(currentPath,item.href) ? 'page' : undefined} onClick={close}>{item.label}</Link>)}
        </nav>
      </details>
    </nav>
  </div>;
}
