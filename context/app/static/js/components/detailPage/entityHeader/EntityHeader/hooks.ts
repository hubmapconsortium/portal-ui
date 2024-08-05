import { Dispatch, SetStateAction, useCallback } from 'react';
import { useSprings } from '@react-spring/web';

import { headerHeight } from 'js/components/Header/HeaderAppBar/style';
import { useEntityStore } from 'js/stores';

export type SummaryViewsType = 'narrow' | 'summary';
export type SetViewType = Dispatch<SetStateAction<SummaryViewsType>>;

const initialEntityHeaderHeight = 40;

const initialHeightOffset = headerHeight + 16;

const expandedContentHeight = 300;

function useEntityHeaderSprings() {
  const springs = useSprings(2, (springIndex) => {
    if (springIndex === 0) {
      return {
        height: initialEntityHeaderHeight,
      };
    }
    if (springIndex === 1) {
      return {
        top: initialHeightOffset + initialEntityHeaderHeight,
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
    (isExpanded: boolean) => {
      async function startSprings() {
        await Promise.all(
          springAPIs.start((springIndex: number) => {
            if (springIndex === 0) {
              return {
                height: isExpanded ? expandedContentHeight + initialEntityHeaderHeight : initialEntityHeaderHeight,
              };
            }
            if (springIndex === 1) {
              return {
                top: isExpanded
                  ? initialHeightOffset + expandedContentHeight
                  : initialHeightOffset + initialEntityHeaderHeight,
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

export { useEntityHeaderSprings, useStartViewChangeSpring };
