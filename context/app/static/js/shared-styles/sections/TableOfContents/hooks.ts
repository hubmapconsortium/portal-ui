import React, { MutableRefObject } from 'react';
import { throttle } from 'js/helpers/functions';
import { headerHeight } from 'js/components/Header/HeaderAppBar/style';
import useEntityStore, { EntityStore } from 'js/stores/useEntityStore';
import { useSpring } from '@react-spring/web';
import { entityHeaderHeight } from 'js/components/detailPage/entityHeader/EntityHeader';
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

      if (item.node && item.node.offsetTop < d.scrollTop + d.clientHeight / 8) {
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
  const { summaryInView } = useEntityStore((state: EntityStore) => state.summaryComponentObserver);
  const initialHeightOffset = headerHeight + 16;
  const top = summaryInView ? `${initialHeightOffset}px` : `${initialHeightOffset + entityHeaderHeight}px`;
  const stickyNavAnimationProps = useSpring({ top });

  return stickyNavAnimationProps;
}

export { useThrottledOnScroll, useFindActiveIndex, useAnimatedSidebarPosition };
