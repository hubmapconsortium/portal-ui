import React, { MutableRefObject } from 'react';
import { throttle } from 'js/helpers/functions';
import useEntityStore from 'js/stores/useEntityStore';
import { SpringValues } from '@react-spring/web';
import { TableOfContentsNodesRef } from './types';

function useThrottledOnScroll(callback: (() => void) | null, delay: number) {
  const throttledCallback = React.useMemo(() => (callback ? throttle(callback, delay) : null), [callback, delay]);

  React.useEffect(() => {
    if (throttledCallback === null) {
      return undefined;
    }

    window.addEventListener('scroll', throttledCallback);
    return () => {
      window.removeEventListener('scroll', throttledCallback);
    };
  }, [throttledCallback]);
}

function useFindActiveIndex({
  clickedRef,
  itemsWithNodeRef,
  currentSection,
  setCurrentSection,
}: {
  clickedRef: MutableRefObject<boolean>;
  itemsWithNodeRef: TableOfContentsNodesRef;
  currentSection: string;
  setCurrentSection: (section: React.SetStateAction<string>) => void;
}) {
  return React.useCallback(() => {
    // Don't set the active index based on scroll if a link was just clicked
    if (clickedRef.current) {
      return;
    }

    let active;
    const d = document.documentElement;

    for (let i = itemsWithNodeRef.current.length - 1; i >= 0; i -= 1) {
      const item = itemsWithNodeRef.current[i];

      const element = document.getElementById(item.hash);
      const rect = element?.getBoundingClientRect();
      const adjustedOffset = rect ? rect.top / 4 + window.scrollY : 0;

      if (adjustedOffset < d.scrollTop + d.clientHeight / 8) {
        active = item;
        break;
      }
    }

    if (active && currentSection !== active.hash) {
      setCurrentSection(active.hash);
    }
  }, [currentSection, setCurrentSection, clickedRef, itemsWithNodeRef]);
}

function useAnimatedSidebarPosition() {
  const { springs } = useEntityStore();

  const [springValues] = springs;

  if (springValues[1] === undefined) {
    return null;
  }

  return springValues[1] as SpringValues;
}

export { useThrottledOnScroll, useFindActiveIndex, useAnimatedSidebarPosition };
