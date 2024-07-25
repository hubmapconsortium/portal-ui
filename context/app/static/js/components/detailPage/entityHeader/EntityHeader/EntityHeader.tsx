import React, { useRef, useEffect } from 'react';
import useResizeObserver from 'use-resize-observer/polyfilled';

import { useEntityStore, type EntityStore } from 'js/stores/useEntityStore';
import { StyledPaper } from './style';
import EntityHeaderContent from '../EntityHeaderContent';

const entityStoreSelector = (state: EntityStore) => state.setEntityHeaderHeight;

const entityHeaderHeight = 40;

function Header() {
  const setEntityHeaderHeight = useEntityStore(entityStoreSelector);

  const ref = useRef(null);
  const { height = 40 } = useResizeObserver({ ref });

  useEffect(() => {
    setEntityHeaderHeight(height);
  }, [height, setEntityHeaderHeight]);

  return (
    <StyledPaper elevation={4} data-testid="entity-header" ref={ref}>
      <EntityHeaderContent />
    </StyledPaper>
  );
}

export { entityHeaderHeight };
export default Header;
