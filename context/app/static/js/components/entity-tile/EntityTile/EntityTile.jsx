import React from 'react';

import EntityTileBottom from '../EntityTileBottom';
import EntityTileTop from '../EntityTileTop';
import { StyledPaper, HoverOverlay } from './style';

function EntityTile(props) {
  const { uuid, entity_type, id, invertColors, entityData, descendantCounts } = props;

  return (
    <a href={`/browse/${entity_type.toLowerCase()}/${uuid}`}>
      <StyledPaper $invertColors={invertColors}>
        <HoverOverlay $invertColors={invertColors}>
          <EntityTileTop entity_type={entity_type} id={id} invertColors={invertColors} entityData={entityData} />
          <EntityTileBottom invertColors={invertColors} entityData={entityData} descendantCounts={descendantCounts} />
        </HoverOverlay>
      </StyledPaper>
    </a>
  );
}

export default EntityTile;
