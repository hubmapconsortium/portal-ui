import { useEffect, useState, useRef, useCallback, RefObject } from 'react';

/**
 * Returns a 0-1 scroll progress value for an element based on its position in the viewport.
 * Progress is 0 when the element enters the viewport from the bottom,
 * and approaches 1 as it scrolls past the top.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);
  const rafId = useRef<number>(0);

  const handleScroll = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      const element = ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress: 0 when element top is at bottom of viewport,
      // 1 when element top has scrolled past the top of the viewport by its height
      const rawProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
      setProgress(Math.min(1, Math.max(0, rawProgress)));
    });
  }, [ref]);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleScroll]);

  return progress;
}

/**
 * Detects the user's prefers-reduced-motion setting.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}
