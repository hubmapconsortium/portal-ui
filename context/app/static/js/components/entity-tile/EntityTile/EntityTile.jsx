import React from 'react';

import EntityTileBottom from '../EntityTileBottom';
import EntityTileTop from '../EntityTileTop';
import { StyledPaper, HoverOverlay } from './style';

function EntityTile(props) {
  const { uuid, entity_type, id, isCurrentEntity, entityData, descendantCounts } = props;

  return (
    <a href={`/browse/${entity_type.toLowerCase()}/${uuid}`}>
      <StyledPaper $isCurrentEntity={isCurrentEntity}>
        <HoverOverlay $isCurrentEntity={isCurrentEntity}>
          <EntityTileTop entity_type={entity_type} id={id} isCurrentEntity={isCurrentEntity} entityData={entityData} />
          <EntityTileBottom
            isCurrentEntity={isCurrentEntity}
            entityData={entityData}
            descendantCounts={descendantCounts}
          />
        </HoverOverlay>
      </StyledPaper>
    </a>
  );
}

export default EntityTile;
