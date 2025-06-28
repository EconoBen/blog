/**
 * Mobile Scroll Position Fix
 * Handles scroll position issues on mobile devices, particularly iOS
 */

export function initializeMobileScrollFix() {
  // Only run on mobile devices
  if (!isMobileDevice()) return;

  // Force scroll to top on page load
  window.scrollTo(0, 0);

  // Disable automatic scroll restoration
  if (typeof window.history !== 'undefined' && window.history.scrollRestoration) {
    window.history.scrollRestoration = 'manual';
  }

  // Handle client-side navigation
  handleClientSideNavigation();
  
  // iOS-specific fixes
  if (isIOS()) {
    handleIOSSpecificFixes();
  }
}

/**
 * Check if device is mobile
 */
function isMobileDevice() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
         window.innerWidth <= 768;
}

/**
 * Check if device is iOS
 */
function isIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/**
 * Handle client-side navigation scroll reset
 */
function handleClientSideNavigation() {
  // Reset scroll on route changes for React Router
  const handleRouteChange = () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 10);
  };

  // Listen for popstate events (browser back/forward)
  window.addEventListener('popstate', handleRouteChange);

  // Override link clicks for client-side navigation
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (link && !link.href.startsWith('#') && !link.target) {
      // Give React Router time to handle the navigation
      setTimeout(handleRouteChange, 50);
    }
  });
}

/**
 * iOS-specific scroll fixes
 */
function handleIOSSpecificFixes() {
  // Prevent rubber-band scrolling
  document.body.style.overscrollBehavior = 'none';
  
  // Fix for iOS Safari address bar
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', setVH);
  
  // Prevent bounce effect on overscroll
  let startY = 0;
  
  document.addEventListener('touchstart', (e) => {
    startY = e.touches[0].pageY;
  }, { passive: true });
  
  document.addEventListener('touchmove', (e) => {
    const y = e.touches[0].pageY;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    // Prevent overscroll at top
    if (scrollTop <= 0 && y > startY) {
      e.preventDefault();
    }
    
    // Prevent overscroll at bottom
    if (scrollTop + clientHeight >= scrollHeight && y < startY) {
      e.preventDefault();
    }
  }, { passive: false });
}

/**
 * Force scroll to top (utility function)
 */
export function forceScrollToTop() {
  window.scrollTo(0, 0);
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  
  // For iOS
  if (isIOS()) {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }
}