import React from 'react';
import { animated, useSpring } from 'react-spring';

import { useEntityStore, useVisualizationStore } from 'js/stores';
import { iconButtonHeight } from 'js/shared-styles/buttons';
import { StyledPaper } from './style';
import EntityHeaderContent from '../EntityHeaderContent';

const AnimatedPaper = animated(StyledPaper);
const entityStoreSelector = (state) => ({
  assayMetadata: state.assayMetadata,
  summaryComponentObserver: state.summaryComponentObserver,
});
const visualizationSelector = (state) => ({
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
    overflow: 'hidden',
    height: shouldDisplayHeader ? entityHeaderHeight : 0,
  });

  return (
    <AnimatedPaper style={styles} elevation={4}>
      <EntityHeaderContent
        assayMetadata={assayMetadata}
        shouldDisplayHeader={shouldDisplayHeader}
        vizIsFullscreen={vizIsFullscreen}
      />
    </AnimatedPaper>
  );
}
export { entityHeaderHeight };
export default Header;
