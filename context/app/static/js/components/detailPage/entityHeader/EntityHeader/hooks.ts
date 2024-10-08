import { useCallback } from 'react';
import { useSprings } from '@react-spring/web';

import { headerHeight } from 'js/components/Header/HeaderAppBar/style';
import useEntityStore, { SummaryViewsType } from 'js/stores/useEntityStore';

export const initialEntityHeaderHeight = 48;

export const initialHeaderOffset = headerHeight + 16;

const expandedHeights = {
  diagram: 300,
  summary: 'fit-content',
  narrow: 0,
};

function useTotalHeaderOffset() {
  const { view, summaryHeight } = useEntityStore();
  const contentHeight = view === 'summary' ? summaryHeight : expandedHeights[view];

  return contentHeight + initialEntityHeaderHeight + headerHeight;
}

function useEntityHeaderSprings() {
  const springs = useSprings(2, (springIndex) => {
    if (springIndex === 0) {
      return {
        height: initialEntityHeaderHeight,
      };
    }
    if (springIndex === 1) {
      return {
        top: initialHeaderOffset + initialEntityHeaderHeight,
      };
    }
    return {};
  });

  return { springs };
}

function useStartViewChangeSpring() {
  const { springs, summaryHeight } = useEntityStore();

  const [, springAPIs] = springs;

  return useCallback(
    (view: SummaryViewsType) => {
      const isExpanded = view !== 'narrow';
      const contentHeight = view === 'summary' ? summaryHeight : expandedHeights[view];

      async function startSprings() {
        await Promise.all(
          springAPIs.start((springIndex: number) => {
            if (springIndex === 0) {
              return {
                height: isExpanded ? contentHeight + initialEntityHeaderHeight : initialEntityHeaderHeight,
              };
            }
            if (springIndex === 1) {
              return {
                top: isExpanded
                  ? contentHeight + initialEntityHeaderHeight + initialHeaderOffset
                  : initialHeaderOffset + initialEntityHeaderHeight,
              };
            }

            return {};
          }),
        );
      }
      startSprings().catch((e) => console.error(e));
    },
    [springAPIs, summaryHeight],
  );
}

export { useEntityHeaderSprings, useStartViewChangeSpring, expandedHeights, useTotalHeaderOffset };
