'use client';

import NavBar from './NavBar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </>
  );
}