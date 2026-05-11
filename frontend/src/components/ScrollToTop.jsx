import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Full reset of document scroll on navigation so the next screen always starts at the top.
 * - Disables native scroll restoration (SPAs otherwise keep the previous page’s scroll offset).
 * - Runs in useLayoutEffect (before paint) plus a microtask / rAF pass for late layout (images, fonts).
 * - Depends on pathname, search, and location.key (hash-only jumps on the same URL are left alone).
 */
function scrollWindowToTop() {
  const root = document.scrollingElement || document.documentElement;
  root.scrollTop = 0;
  root.scrollLeft = 0;
  if (document.body) {
    document.body.scrollTop = 0;
    document.body.scrollLeft = 0;
  }
  try {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  } catch {
    window.scrollTo(0, 0);
  }
}

export default function ScrollToTop() {
  const { pathname, search, key } = useLocation();
  const didInitRestoration = useRef(false);

  useLayoutEffect(() => {
    if (didInitRestoration.current) return;
    didInitRestoration.current = true;
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    scrollWindowToTop();
    const t = window.setTimeout(scrollWindowToTop, 0);
    const raf = window.requestAnimationFrame(scrollWindowToTop);
    return () => {
      window.clearTimeout(t);
      window.cancelAnimationFrame(raf);
    };
    // Intentionally omit `hash`: same-route anchor links should not jump the page to top.
  }, [pathname, search, key]);

  return null;
}
