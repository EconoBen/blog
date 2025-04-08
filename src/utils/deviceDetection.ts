/**
 * Utility function to detect if the current device is a mobile device.
 * Uses viewport width to determine if the device is mobile.
 *
 * @returns {boolean} True if the device is mobile, false otherwise
 */
export const isMobileDevice = (): boolean => {
  // Check if window is available (for SSR environments)
  if (typeof window === 'undefined') {
    return false;
  }

  return window.innerWidth <= 768;
};
