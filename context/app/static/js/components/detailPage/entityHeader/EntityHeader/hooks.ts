import { useCallback } from 'react';
import { useSprings } from '@react-spring/web';

import { headerHeight } from 'js/components/Header/HeaderAppBar/style';
import useEntityStore, { SummaryViewsType } from 'js/stores/useEntityStore';

export const initialEntityHeaderHeight = 48;

export const initialHeaderOffset = headerHeight + 16;

const expandedHeights = {
  diagram: 300,
  summary: 150,
  narrow: 0,
};

function useTotalHeaderOffset() {
  const { view } = useEntityStore();

  return expandedHeights[view] + initialEntityHeaderHeight + headerHeight;
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
  const { springs } = useEntityStore();

  const [, springAPIs] = springs;

  return useCallback(
    (view: SummaryViewsType) => {
      const isExpanded = view !== 'narrow';
      async function startSprings() {
        await Promise.all(
          springAPIs.start((springIndex: number) => {
            if (springIndex === 0) {
              return {
                height: isExpanded ? expandedHeights[view] + initialEntityHeaderHeight : initialEntityHeaderHeight,
              };
            }
            if (springIndex === 1) {
              return {
                top: isExpanded
                  ? initialHeaderOffset + expandedHeights[view] + initialEntityHeaderHeight
                  : initialHeaderOffset + initialEntityHeaderHeight,
              };
            }

            return {};
          }),
        );
      }
      startSprings().catch((e) => console.error(e));
    },
    [springAPIs],
  );
}

export { useEntityHeaderSprings, useStartViewChangeSpring, expandedHeights, useTotalHeaderOffset };
