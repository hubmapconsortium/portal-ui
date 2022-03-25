import React from 'react';

import { useVisualizationStore } from 'js/stores';
import { iconButtonHeight } from 'js/shared-styles/buttons';
import { StyledPaper } from './style';
import EntityHeaderContent from '../EntityHeaderContent';
import { extractHeaderMetadata } from './utils';

const visualizationSelector = (state) => ({
  vizIsFullscreen: state.vizIsFullscreen,
});

const entityHeaderHeight = iconButtonHeight;

function Header({ assayMetadata }) {
  const { vizIsFullscreen } = useVisualizationStore(visualizationSelector);

  const { hubmap_id, entity_type, uuid } = assayMetadata;

  const data = extractHeaderMetadata(assayMetadata, entity_type);
  return (
    <StyledPaper elevation={4}>
      <EntityHeaderContent
        uuid={uuid}
        hubmap_id={hubmap_id}
        entity_type={entity_type}
        data={data}
        vizIsFullscreen={vizIsFullscreen}
      />
    </StyledPaper>
  );
}
export { entityHeaderHeight };
export default Header;
