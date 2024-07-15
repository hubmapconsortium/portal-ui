import React from 'react';
import { animated, useSpring } from '@react-spring/web';

import { useEntityStore, type EntityStore } from 'js/stores/useEntityStore';
import { useVisualizationStore, type VisualizationStore } from 'js/stores/useVisualizationStore';
import { iconButtonHeight } from 'js/shared-styles/buttons';
import { StyledPaper } from './style';
import EntityHeaderContent from '../EntityHeaderContent';

const AnimatedPaper = animated(StyledPaper);

const entityStoreSelector = (state: EntityStore) => ({
  assayMetadata: state.assayMetadata,
  summaryComponentObserver: state.summaryComponentObserver,
});

const visualizationSelector = (state: VisualizationStore) => ({
  vizIsFullscreen: state.vizIsFullscreen,
});

const entityHeaderHeight = iconButtonHeight;

function Header() {
  const {
    assayMetadata,
    summaryComponentObserver: { summaryInView },
  } = useEntityStore(entityStoreSelector);
  const { vizIsFullscreen } = useVisualizationStore(visualizationSelector);

  const shouldDisplayHeader = !summaryInView || vizIsFullscreen;

  const styles = useSpring({
    from: {
      height: 0,
      overflow: 'hidden',
    },
    to: {
      height: shouldDisplayHeader ? entityHeaderHeight : 0,
      overflow: 'hidden',
    },
  });

  return (
    <AnimatedPaper style={styles} elevation={4} data-testid="entity-header">
      <EntityHeaderContent assayMetadata={assayMetadata} shouldDisplayHeader={shouldDisplayHeader} vizIsFullscreen />
    </AnimatedPaper>
  );
}
export { entityHeaderHeight };
export default Header;
