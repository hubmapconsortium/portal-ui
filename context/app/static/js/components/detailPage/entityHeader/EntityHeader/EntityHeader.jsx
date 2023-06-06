import React from 'react';
import { useTransition, animated } from 'react-spring';

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

  const transitionConfig = vizIsFullscreen
    ? {}
    : {
        from: { overflow: 'hidden', height: 0 },
        enter: { height: entityHeaderHeight },
        leave: { overflow: 'hidden', height: 0 },
      };
  const transitions = useTransition(shouldDisplayHeader, transitionConfig);

  return transitions(
    ({ item, key, style }) =>
      item && (
        <AnimatedPaper key={key} style={style} elevation={4}>
          <EntityHeaderContent
            assayMetadata={assayMetadata}
            shouldDisplayHeader={shouldDisplayHeader}
            vizIsFullscreen={vizIsFullscreen}
          />
        </AnimatedPaper>
      ),
  );
}
export { entityHeaderHeight };
export default Header;
