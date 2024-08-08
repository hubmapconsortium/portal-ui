import React, { useCallback } from 'react';
import { animated } from '@react-spring/web';
import Box from '@mui/material/Box';

import useEntityStore, { SummaryViewsType } from 'js/stores/useEntityStore';
import { useIsLargeDesktop } from 'js/hooks/media-queries';
import { StyledPaper } from './style';
import EntityHeaderContent from '../EntityHeaderContent';
import { useStartViewChangeSpring, expandedHeights } from './hooks';
import DatasetRelationships from '../../DatasetRelationships';
import SummaryBody from '../../summary/SummaryBody';

const entityHeaderHeight = 48;

const AnimatedPaper = animated(StyledPaper);

function Header() {
  const { assayMetadata, springs, view, setView } = useEntityStore();
  const startViewChangeSpring = useStartViewChangeSpring();
  const isLargeDesktop = useIsLargeDesktop();

  const handleViewChange = useCallback(
    (v: SummaryViewsType) => {
      setView(v);
      startViewChangeSpring(v);
    },
    [startViewChangeSpring, setView],
  );

  const [springValues] = springs;

  if (springValues[0] === undefined) {
    return null;
  }
  const { uuid } = assayMetadata;

  return (
    <AnimatedPaper elevation={4} data-testid="entity-header" sx={{ overflow: 'hidden' }} style={springValues[0]}>
      <Box>
        <EntityHeaderContent setView={handleViewChange} view={view} />
        {isLargeDesktop && (
          <Box height={expandedHeights[view]} width="100%" p={2}>
            {view === 'diagram' && uuid && <DatasetRelationships uuid={uuid} processing="raw" showHeader={false} />}
            {view === 'summary' && <SummaryBody direction="row" spacing={2} component={Box} clamp />}
          </Box>
        )}
      </Box>
    </AnimatedPaper>
  );
}

export { entityHeaderHeight };
export default Header;
