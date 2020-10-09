import React from 'react';
import { useTransition, animated } from 'react-spring';

import { useEntityStore, useVisualizationStore } from 'js/stores';
import { iconButtonHeight } from 'js/shared-styles/buttons';
import { StyledPaper } from './style';
import EntityHeaderContent from '../EntityHeaderContent';
import { extractHeaderMetadata } from './utils';

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
  const transitions = useTransition(shouldDisplayHeader, null, transitionConfig);
  const { display_doi, entity_type } = assayMetadata;

  const data = extractHeaderMetadata(assayMetadata, entity_type);
  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <AnimatedPaper key={key} style={props} elevation={4}>
          <EntityHeaderContent
            display_doi={display_doi}
            entity_type={entity_type}
            data={data}
            shouldDisplayHeader={shouldDisplayHeader}
            vizIsFullscreen={vizIsFullscreen}
          />
        </AnimatedPaper>
      ),
  );
}
export { entityHeaderHeight };
export default Header;
