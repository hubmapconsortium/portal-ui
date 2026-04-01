import { DependencyList, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

export const SINGLE_ROW_HEIGHT = 40;

/**
 * Measures how many child elements overflow past a single row in a
 * container that uses `maxHeight` + `overflow: hidden` to clip content.
 *
 * Returns a ref to attach to the container, expand/collapse state, and
 * the number of hidden children.
 */
export default function useOverflowCount(hasContent: boolean, deps: DependencyList) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [overflowCount, setOverflowCount] = useState(0);

  const measureOverflow = useCallback(() => {
    if (!containerRef.current || isExpanded) {
      if (isExpanded) setOverflowCount(0);
      return;
    }
    const container = containerRef.current;
    const children = Array.from(container.children) as HTMLElement[];
    if (children.length === 0) {
      setOverflowCount(0);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const containerBottom = containerRect.top + SINGLE_ROW_HEIGHT;
    const hidden = children.filter((child) => {
      const childRect = child.getBoundingClientRect();
      return childRect.top >= containerBottom;
    });
    setOverflowCount(hidden.length);
  }, [isExpanded]);

  // Measure after each render when dependencies change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => measureOverflow(), [measureOverflow, ...deps]);

  // Re-measure on container resize
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => measureOverflow());
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [measureOverflow]);

  // Collapse when content is cleared
  useEffect(() => {
    if (!hasContent) {
      setIsExpanded(false);
    }
  }, [hasContent]);

  return { containerRef, isExpanded, setIsExpanded, overflowCount };
}
