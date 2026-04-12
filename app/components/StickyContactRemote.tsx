'use client';

import { useEffect, useState } from 'react';

export function StickyContactRemote() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const footer = document.querySelector('footer');
      if (!footer) return;
      const footerTop = footer.getBoundingClientRect().top;
      // Hide when the footer is within 80px of the bottom of the viewport
      setHidden(footerTop < window.innerHeight - 20);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-4 z-40 hidden transition-all duration-300 lg:block xl:right-6 ${
        hidden ? 'pointer-events-none translate-y-4 opacity-0' : 'opacity-100'
      }`}
    >
      <div className="sticky-note overflow-hidden flex flex-col gap-2 p-2">
        <a
          href="mailto:benjaminlabaschin@gmail.com"
          title="Email"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-low text-on-surface transition-transform hover:-translate-y-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z"/><path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z"/></svg>
        </a>
        <a
          href="https://github.com/econoben"
          target="_blank"
          rel="noreferrer noopener"
          title="GitHub"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-low text-on-surface transition-transform hover:-translate-y-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd"/></svg>
        </a>
        <a
          href="https://linkedin.com/in/benjamin-labaschin"
          target="_blank"
          rel="noreferrer noopener"
          title="LinkedIn"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-low text-on-surface transition-transform hover:-translate-y-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path d="M4.5 2.5a2 2 0 11-4 0 2 2 0 014 0zM.5 6h4v12h-4V6zm7.5 0h3.5v1.6h.05C12.4 6.6 13.9 5.8 15.7 5.8c4 0 4.3 2.6 4.3 6v7.2h-4V12.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.6H8V6z"/></svg>
        </a>
        <div className="h-px w-full bg-outline-variant/20" />
        <a
          href="/benjamin_labaschin_resume.pdf"
          download
          title="Download CV"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c0c4cc] bg-transparent text-on-surface transition-transform hover:-translate-y-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z"/><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z"/></svg>
        </a>
      </div>
    </div>
  );
}
