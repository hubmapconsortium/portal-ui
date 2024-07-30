import { useRef, useState, Dispatch, SetStateAction } from 'react';
import { useSprings } from '@react-spring/web';
import useResizeObserver from 'use-resize-observer/polyfilled';

import { headerHeight } from 'js/components/Header/HeaderAppBar/style';

export type SummaryViewsType = 'narrow' | 'summary';
export type SetViewType = Dispatch<SetStateAction<SummaryViewsType>>;

const initialEntityHeaderHeight = 40;

const initialHeightOffset = headerHeight + 16;

function useEntityHeaderAnimations() {
  const [selectedView, setView] = useState<SummaryViewsType>('narrow');
  const entityHeaderRef = useRef(null);
  const expandedContentRef = useRef(null);

  const { height: expandedContentHeight = initialEntityHeaderHeight } = useResizeObserver({ ref: expandedContentRef });

  const isExpanded = selectedView !== 'narrow';

  const springs = useSprings(
    2,
    (springIndex) => {
      if (springIndex === 0) {
        return {
          height: isExpanded ? expandedContentHeight : initialEntityHeaderHeight,
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
    },
    [isExpanded],
  );

  return { selectedView, setView, entityHeaderRef, expandedContentRef, springs };
}

export { useEntityHeaderAnimations };
