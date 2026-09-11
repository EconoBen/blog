'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// This document-local marker survives the home page unmounting. It carries no
// artwork, arrival controller, or persistent storage into other routes.
let restoredPath: string | null = null;

export function isRestoredArrivalVisit(pathname: string): boolean {
  return restoredPath === pathname;
}

export default function ArrivalVisitMarker() {
  const pathname = usePathname();

  useEffect(() => {
    const onHistory = () => { restoredPath = window.location.pathname; };
    window.addEventListener('popstate', onHistory);
    return () => window.removeEventListener('popstate', onHistory);
  }, []);

  useEffect(() => {
    // Preserve the Back destination until its page mounts. A later deliberate
    // visit to another route clears it without consuming the arrival session.
    if (pathname === window.location.pathname && restoredPath !== pathname) restoredPath = null;
  }, [pathname]);

  return null;
}
