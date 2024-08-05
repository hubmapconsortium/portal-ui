import React, { useCallback } from 'react';
import { animated } from '@react-spring/web';
import Box from '@mui/material/Box';

import useEntityStore, { SummaryViewsType } from 'js/stores/useEntityStore';
import { StyledPaper } from './style';
import EntityHeaderContent from '../EntityHeaderContent';
import { useStartViewChangeSpring } from './hooks';
import DatasetRelationships from '../../DatasetRelationships';

const entityHeaderHeight = 40;

const AnimatedPaper = animated(StyledPaper);

function Header() {
  const { assayMetadata, springs, view, setView } = useEntityStore();
  const startViewChangeSpring = useStartViewChangeSpring();

  const handleViewChange = useCallback(
    (v: SummaryViewsType) => {
      const isExpanded = v !== 'narrow';
      setView(v);
      startViewChangeSpring(isExpanded);
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
        <Box height={300} width="100%" p={2}>
          {view === 'diagram' && uuid && <DatasetRelationships uuid={uuid} processing="raw" showHeader={false} />}
        </Box>
      </Box>
    </AnimatedPaper>
  );
}

export { entityHeaderHeight };
export default Header;
