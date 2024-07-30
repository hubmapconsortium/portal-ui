import React, { useEffect, Dispatch, SetStateAction } from 'react';
import { animated } from '@react-spring/web';
import Box from '@mui/material/Box';

import { useEntityStore, type EntityStore } from 'js/stores/useEntityStore';
import { StyledPaper } from './style';
import EntityHeaderContent from '../EntityHeaderContent';
import { useEntityHeaderAnimations } from './hooks';

const entityStoreSelector = (state: EntityStore) => state.setEntityHeaderSprings;

const entityHeaderHeight = 40;

export type SummaryViewsType = 'narrow' | 'summary';
export type SetViewType = Dispatch<SetStateAction<SummaryViewsType>>;

const AnimatedPaper = animated(StyledPaper);

function Header() {
  const { setView, selectedView, entityHeaderRef, expandedContentRef, springs } = useEntityHeaderAnimations();
  const setEntityHeaderSprings = useEntityStore(entityStoreSelector);

  useEffect(() => setEntityHeaderSprings(springs), [springs, setEntityHeaderSprings]);

  if (springs[0][0] === undefined) {
    return null;
  }

  return (
    <AnimatedPaper
      elevation={4}
      data-testid="entity-header"
      sx={{ overflow: 'hidden' }}
      ref={entityHeaderRef}
      style={springs[0][0]}
    >
      <Box ref={expandedContentRef}>
        <EntityHeaderContent setView={setView} view={selectedView} />
        <Box height={200} width="100%" sx={{ backgroundColor: 'red' }} />
      </Box>
    </AnimatedPaper>
  );
}

export { entityHeaderHeight };
export default Header;
