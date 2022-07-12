import React from 'react';
import PropTypes from 'prop-types';

import Tile from 'js/shared-styles/tiles/Tile';
import { Flex, StyledDiv } from './style';

function EntityTileBody({ entity_type, id, entityData, invertColors }) {
  return (
    <StyledDiv>
      <Tile.Title>{id}</Tile.Title>
      {'origin_sample' in entityData && <Tile.Text>{entityData.origin_sample.mapped_organ}</Tile.Text>}
      {'mapped_specimen_type' in entityData && <Tile.Text>{entityData.mapped_specimen_type}</Tile.Text>}
      {'mapped_data_types' in entityData && <Tile.Text>{entityData.mapped_data_types.join(', ')}</Tile.Text>}
      {entity_type === 'Donor' && 'mapped_metadata' in entityData && (
        <>
          <Flex>
            <Tile.Text>{entityData.mapped_metadata.sex}</Tile.Text>
            <Tile.Divider invertColors={invertColors} />
            <Tile.Text>
              {entityData.mapped_metadata.age_value} {entityData.mapped_metadata.age_unit}
            </Tile.Text>
          </Flex>
          <Tile.Text>{entityData.mapped_metadata.race.join(', ')}</Tile.Text>
        </>
      )}
    </StyledDiv>
  );
}

EntityTileBody.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  entityData: PropTypes.object.isRequired,
  entity_type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  invertColors: PropTypes.bool,
};

EntityTileBody.defaultProps = {
  invertColors: false,
};

export default EntityTileBody;
