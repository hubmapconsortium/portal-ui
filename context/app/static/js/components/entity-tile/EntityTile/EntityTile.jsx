import React from 'react';
import PropTypes from 'prop-types';

import Tile from 'js/shared-styles/tiles/Tile/';
import { DatasetIcon } from 'js/shared-styles/icons';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import EntityTileFooter from '../EntityTileFooter';
import EntityTileBody from '../EntityTileBody';
import { StyledIcon } from './style';

const tileWidth = 310;

function EntityTile({ uuid, entity_type, id, invertColors, entityData, descendantCounts, ...rest }) {
  return (
    <Tile
      href={`/browse/${entity_type.toLowerCase()}/${uuid}`}
      invertColors={invertColors}
      icon={<StyledIcon component={entityIconMap[entity_type] || DatasetIcon} />}
      bodyContent={
        <EntityTileBody entity_type={entity_type} id={id} invertColors={invertColors} entityData={entityData} />
      }
      footerContent={
        <EntityTileFooter
          invertColors={invertColors}
          last_modified_timestamp={entityData?.last_modified_timestamp}
          descendantCounts={descendantCounts}
        />
      }
      tileWidth={tileWidth}
      {...rest}
    />
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

export { tileWidth };
export default EntityTile;
