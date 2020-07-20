import React from 'react';

import EntityTileBottom from '../EntityTileBottom';
import EntityTileTop from '../EntityTileTop';
import { StyledPaper } from './style';

function EntityTile(props) {
  const { uuid, entity_type, id, invertColors, entityData, descendantCounts } = props;

  return (
    <a href={`/browse/${entity_type.toLowerCase()}/${uuid}`}>
      <StyledPaper $invertColors={invertColors}>
        <EntityTileTop entity_type={entity_type} id={id} invertColors={invertColors} entityData={entityData} />
        <EntityTileBottom invertColors={invertColors} entityData={entityData} descendantCounts={descendantCounts} />
      </StyledPaper>
    </a>
  );
}

export default EntityTile;
