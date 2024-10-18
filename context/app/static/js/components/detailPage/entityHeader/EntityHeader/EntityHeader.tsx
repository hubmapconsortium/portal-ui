import React, { useCallback, useEffect, useRef } from 'react';
import { animated } from '@react-spring/web';
import Box from '@mui/material/Box';

import useEntityStore, { SummaryViewsType } from 'js/stores/useEntityStore';
import { useIsLargeDesktop } from 'js/hooks/media-queries';
import { useFlaskDataContext } from 'js/components/Contexts';
import { useVisualizationStore, type VisualizationStore } from 'js/stores/useVisualizationStore';
import { StyledPaper } from './style';
import EntityHeaderContent from '../EntityHeaderContent';
import { useStartViewChangeSpring, expandedHeights } from './hooks';
import DatasetRelationships from '../../DatasetRelationships';
import SummaryBody from '../../summary/SummaryBody';

const AnimatedPaper = animated(StyledPaper);

const visualizationSelector = (state: VisualizationStore) => ({
  vizIsFullscreen: state.vizIsFullscreen,
});

function Header() {
  const { springs, view, setView, summaryHeight, setSummaryHeight } = useEntityStore();
  const startViewChangeSpring = useStartViewChangeSpring();
  const isLargeDesktop = useIsLargeDesktop();
  const { vizIsFullscreen } = useVisualizationStore(visualizationSelector);

  const { entity } = useFlaskDataContext();
  const uuid = entity?.uuid;

  const summaryBodyRef = useRef<HTMLDivElement | null>(null);

  const handleViewChange = useCallback(
    (v: SummaryViewsType) => {
      setView(v);

      // Delay height ref calculation to allow DOM to fully render
      setTimeout(() => {
        if (summaryBodyRef.current) {
          const newHeight = summaryBodyRef.current.offsetHeight;
          setSummaryHeight(newHeight);
        }
      }, 0);
    },
    [setView, setSummaryHeight],
  );

  useEffect(() => {
    if (summaryHeight !== 0) {
      startViewChangeSpring(view);
    }
  }, [summaryHeight, view, startViewChangeSpring]);

  useEffect(() => {
    if (vizIsFullscreen) {
      handleViewChange('narrow');
    }
  }, [vizIsFullscreen, handleViewChange]);

  // Switch to narrow view if screen size changes from large desktop to smaller
  // Restore previous view when screen size changes back to large desktop
  const previousView = useRef(view);
  const wasLargeDesktop = useRef(isLargeDesktop);
  useEffect(() => {
    if (!isLargeDesktop && wasLargeDesktop.current) {
      previousView.current = view;
      handleViewChange('narrow');
      // Else if is required to prevent infinite loop/maintain functionality
    } else if (isLargeDesktop && !wasLargeDesktop.current) {
      handleViewChange(previousView.current);
    }
    wasLargeDesktop.current = isLargeDesktop;
  }, [isLargeDesktop, handleViewChange, view]);

  const [springValues] = springs;

  if (springValues[0] === undefined) {
    return null;
  }

  return (
    <AnimatedPaper elevation={4} data-testid="entity-header" sx={{ overflow: 'hidden' }} style={springValues[0]}>
      <Box>
        <EntityHeaderContent setView={handleViewChange} view={view} />
        {isLargeDesktop && (
          <Box ref={summaryBodyRef} height={expandedHeights[view]} width="100%" p={2}>
            {view === 'diagram' && uuid && <DatasetRelationships uuid={uuid} processing="raw" showHeader={false} />}
            {view === 'summary' && <SummaryBody direction="row" spacing={2} component={Box} isEntityHeader />}
          </Box>
        )}
      </Box>
    </AnimatedPaper>
  );
}

export default Header;
