import { DependencyList, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

export const SINGLE_ROW_HEIGHT = 40;

/**
 * Reports whether a container clipped to a single row (`maxHeight` +
 * `overflow: hidden`) has content it can't show, plus expand/collapse state.
 *
 * Deliberately a boolean and not a count: a count's digits change the width of
 * the toggle label that renders it, which changes the width of the container
 * being measured, which changes the count — a ResizeObserver feedback loop that
 * flickers in Chrome (CAT-1671). Whatever renders this must stay width-stable.
 */
export default function useHasOverflow(hasContent: boolean, deps: DependencyList) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  // No deps -> stable identity -> the observer below is created exactly once.
  const measure = useCallback(() => {
    const container = containerRef.current;
    // +1 absorbs sub-pixel rounding between the two integer heights.
    setHasOverflow(!!container && container.scrollHeight > container.clientHeight + 1);
  }, []);

  // `isExpanded` lives here, not in `measure`, so collapsing re-measures
  // without tearing down and re-firing the observer.
  useLayoutEffect(measure, [measure, isExpanded, ...deps]);

  // Re-measure on container resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [measure]);

  // Collapse when content is cleared
  useEffect(() => {
    if (!hasContent) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Effect syncs state on external change; derivation isn't a clean substitute.
      setIsExpanded(false);
    }
  }, [hasContent]);

  return { containerRef, isExpanded, setIsExpanded, hasOverflow };
}
