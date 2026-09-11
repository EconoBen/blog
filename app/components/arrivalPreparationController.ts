export const GREBE_ARRIVAL_SESSION_KEY = 'econoben:grebe-arrival:v1';
export const ARRIVAL_PREPARATION_EVENT = 'econoben:arrival-preparation-dismiss';
export type PreparationRelease = 'active' | 'cancel' | 'skip' | 'timeout' | 'unmount';

declare global {
  interface Window {
    __econobenArrivalPreparation?: { release: (reason: PreparationRelease) => void };
  }
}

/** The controller also sees a native Skip/deadline when session storage is denied. */
export function isArrivalPreparationSuppressed(): boolean {
  return typeof document !== 'undefined' && document.documentElement.hasAttribute('data-arrival-suppressed');
}

export function releaseArrivalPreparation(reason: PreparationRelease): void {
  if (typeof window !== 'undefined') window.__econobenArrivalPreparation?.release(reason);
}

/** Self-contained because the server writes this function directly into <head>. */
function prepareBeforePaint(config: { sessionKey: string; event: string; timeout: number }) {
  const root = document.documentElement;
  if (window.__econobenArrivalPreparation) return;
  let release: ((reason: PreparationRelease) => void) | undefined;
  try {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    let seen = false;
    try { seen = window.sessionStorage.getItem(config.sessionKey) !== null; } catch { /* A document marker still supports Skip. */ }
    if (window.location.pathname !== '/' || window.location.hash || window.scrollY > 160 || navigation?.type === 'back_forward' || motion.matches || seen || root.hasAttribute('data-arrival-suppressed')) return;

    let active = true;
    let attached = false;
    let deadline = 0;
    let remaining = config.timeout;
    let visibleSince = window.performance.now();
    let observer: MutationObserver | undefined;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const button = () => document.querySelector<HTMLButtonElement>('#arrival-preparation button');
    const focus = () => button()?.focus({ preventScroll: true });
    const click = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('#arrival-preparation button')) {
        event.preventDefault(); release?.('skip');
      }
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); release?.('skip'); }
      else if (event.key === 'Tab') { event.preventDefault(); focus(); }
    };
    const focusIn = (event: FocusEvent) => {
      if (active && event.target !== button()) focus();
    };
    const departure = () => release?.('cancel');
    const preference = () => { if (motion.matches) release?.('cancel'); };
    const visibility = () => {
      if (deadline) {
        remaining = Math.max(0, remaining - Math.max(0, window.performance.now() - visibleSince));
        window.clearTimeout(deadline); deadline = 0;
      }
      if (active && !document.hidden) {
        visibleSince = window.performance.now();
        deadline = window.setTimeout(() => release?.('timeout'), remaining);
      }
    };
    release = (reason) => {
      if (!active) return;
      active = false;
      window.clearTimeout(deadline);
      observer?.disconnect();
      document.removeEventListener('click', click, true);
      document.removeEventListener('keydown', key, true);
      document.removeEventListener('focusin', focusIn, true);
      document.removeEventListener('visibilitychange', visibility);
      motion.removeEventListener('change', preference);
      for (const event of ['pagehide', 'popstate', 'hashchange']) window.removeEventListener(event, departure);
      root.removeAttribute('data-arrival-preparing');
      if (reason !== 'active' && reason !== 'unmount') {
        root.setAttribute('data-arrival-suppressed', '');
        if (reason === 'skip' || reason === 'timeout') {
          try { window.sessionStorage.setItem(config.sessionKey, '1'); } catch { /* The document marker is sufficient for this visit. */ }
        }
      }
      // The React film may already have transferred focus to its own Skip.
      // Only move it if the now-hidden native button still owns focus.
      const nativeButton = button();
      if (nativeButton && document.activeElement === nativeButton) {
        if (previous?.isConnected && previous !== document.body) previous.focus({ preventScroll: true });
        else nativeButton.blur();
      }
      if (reason !== 'active' && reason !== 'unmount') window.dispatchEvent(new CustomEvent(config.event, { detail: reason }));
    };
    window.__econobenArrivalPreparation = { release };
    document.addEventListener('click', click, true);
    document.addEventListener('keydown', key, true);
    document.addEventListener('focusin', focusIn, true);
    document.addEventListener('visibilitychange', visibility);
    motion.addEventListener('change', preference);
    for (const event of ['pagehide', 'popstate', 'hashchange']) window.addEventListener(event, departure);
    const attach = () => {
      if (!active || attached || !button()) return;
      attached = true; observer?.disconnect(); focus();
    };
    observer = new MutationObserver(attach);
    observer.observe(root, { childList: true, subtree: true });
    visibility();
    // This last step opts in to the CSS. Without a successful script, the
    // server-rendered cover stays hidden and the page remains usable.
    root.setAttribute('data-arrival-preparing', '');
    attach();
  } catch {
    release?.('cancel');
    root.removeAttribute('data-arrival-preparing');
  }
}

export function arrivalPreparationScript(): string {
  return `(${prepareBeforePaint.toString()})(${JSON.stringify({ sessionKey: GREBE_ARRIVAL_SESSION_KEY, event: ARRIVAL_PREPARATION_EVENT, timeout: 4000 })});`;
}
