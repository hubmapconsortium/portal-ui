import React, { useRef, useEffect, useState, Dispatch, SetStateAction } from 'react';
import { animated, useSpring } from '@react-spring/web';
import useResizeObserver from 'use-resize-observer/polyfilled';
import Box from '@mui/material/Box';

import { useEntityStore, type EntityStore } from 'js/stores/useEntityStore';
import { StyledPaper } from './style';
import EntityHeaderContent from '../EntityHeaderContent';

const entityStoreSelector = (state: EntityStore) => state.setEntityHeaderHeight;

const entityHeaderHeight = 40;

export type SummaryViewsType = 'narrow' | 'summary';
export type SetViewType = Dispatch<SetStateAction<SummaryViewsType>>;

const AnimatedPaper = animated(StyledPaper);

function Header() {
  const setEntityHeaderHeight = useEntityStore(entityStoreSelector);
  const [selectedView, setView] = useState<SummaryViewsType>('narrow');

  const ref = useRef(null);
  const ref2 = useRef(null);
  const { height = 40 } = useResizeObserver({ ref });

  const { height: height2 = 40 } = useResizeObserver({ ref: ref2 });

  useEffect(() => {
    setEntityHeaderHeight(height2);
  }, [height2, setEntityHeaderHeight]);

  const styles = useSpring({
    height: selectedView !== 'narrow' ? height : 40,
  });

  return (
    <AnimatedPaper elevation={4} data-testid="entity-header" sx={{ overflow: 'hidden' }} style={styles} ref={ref2}>
      <div>
        <Box ref={ref}>
          <EntityHeaderContent setView={setView} view={selectedView} />
          <Box height={200} width="100%" sx={{ backgroundColor: 'red' }} />
        </Box>
      </div>
    </AnimatedPaper>
  );
}

export { entityHeaderHeight };
export default Header;
