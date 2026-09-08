import React, { useCallback, useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { animated, useSpring } from '@react-spring/web';
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
  vizIsFullscreen: Boolean(state.fullscreenVizId),
});

function Header() {
  const {
    springs,
    view,
    setView,
    summaryHeight,
    setSummaryHeight,
    summaryComponentObserver: { summaryInView },
  } = useEntityStore();
  const startViewChangeSpring = useStartViewChangeSpring();
  const isLargeDesktop = useIsLargeDesktop();
  const { vizIsFullscreen } = useVisualizationStore(useShallow(visualizationSelector));

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

  // The header keeps its sticky slot at all times so that section offsets and visualization
  // sizing stay stable, but the container itself should not be visible until the summary
  // title scrolls out of view. It is also revealed when expanded or when a viz is fullscreen,
  // since it hosts the controls for both.
  const isRevealed = !summaryInView || view !== 'narrow' || vizIsFullscreen;
  const { opacity } = useSpring({ opacity: isRevealed ? 1 : 0 });

  const [springValues] = springs;

  if (springValues[0] === undefined) {
    return null;
  }

  return (
    <AnimatedPaper
      elevation={4}
      data-testid="entity-header"
      sx={{ overflow: 'hidden' }}
      style={{
        ...springValues[0],
        opacity,
        // Hidden rather than merely transparent so the collapsed header cannot be clicked or tabbed into.
        visibility: opacity.to((o) => (o === 0 ? 'hidden' : 'visible')),
      }}
    >
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
