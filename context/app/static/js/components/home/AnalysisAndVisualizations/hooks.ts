import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Tracks which of `count` stacked slides is "prominent" — the top-most slide currently
 * crossing the vertical middle of the viewport. Because the slides stack with increasing
 * z-index, the highest index crossing the middle is the one visually on top. Returns the
 * prominent index and `slideRef(index)`, a stable ref callback to attach to each slide.
 */
export function useProminentSlideIndex(count: number) {
  const [prominentIndex, setProminentIndex] = useState(0);
  const els = useRef<(HTMLElement | null)[]>([]);
  const visible = useRef<Set<number>>(new Set());

  // Stable per-index ref callbacks; the element mutation stays inside the hook.
  const refCallbacks = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => (el: HTMLElement | null) => {
        els.current[index] = el;
      }),
    [count],
  );

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    els.current.forEach((el, index) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) visible.current.add(index);
          else visible.current.delete(index);
          setProminentIndex(visible.current.size > 0 ? Math.max(...visible.current) : 0);
        },
        // A zero-height band at the vertical middle: fires when a slide spans the middle.
        { rootMargin: '-50% 0px -50% 0px' },
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((observer) => observer.disconnect());
  }, [count]);

  return { prominentIndex, slideRef: (index: number) => refCallbacks[index] };
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
