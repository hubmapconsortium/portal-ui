import React from 'react';
import PropTypes from 'prop-types';

import EntityTileFooter from '../EntityTileFooter';
import EntityTileBody from '../EntityTileBody';
import { StyledPaper } from './style';

function EntityTile(props) {
  const { uuid, entity_type, id, invertColors, entityData, descendantCounts } = props;

  return (
    <a href={`/browse/${entity_type.toLowerCase()}/${uuid}`}>
      <StyledPaper $invertColors={invertColors}>
        <EntityTileBody entity_type={entity_type} id={id} invertColors={invertColors} entityData={entityData} />
        <EntityTileFooter invertColors={invertColors} entityData={entityData} descendantCounts={descendantCounts} />
      </StyledPaper>
    </a>
  );
}

EntityTile.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  entityData: PropTypes.object.isRequired,
  uuid: PropTypes.string.isRequired,
  entity_type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  descendantCounts: PropTypes.shape({ Dataset: PropTypes.number, Sample: PropTypes.number }),
  invertColors: PropTypes.bool,
};

EntityTile.defaultProps = {
  descendantCounts: {},
  invertColors: false,
};

export default EntityTile;
