import React from 'react';
import PropTypes from 'prop-types';

import Tile from 'js/shared-styles/tiles/Tile';
import EntityTileThumbnail from 'js/components/entity-tile/EntityTileThumbnail';
import { getOriginSamplesOrgan } from 'js/helpers/functions';
import { Flex, StyledDiv, BodyWrapper } from './style';

const thumbnailDimension = 80;
function EntityTileBody({ entity_type, id, entityData, invertColors }) {
  const { thumbnail_file } = entityData;
  return (
    <BodyWrapper $thumbnailDimension={thumbnailDimension}>
      <StyledDiv>
        <Tile.Title>{id}</Tile.Title>
        {'origin_samples' in entityData && <Tile.Text>{getOriginSamplesOrgan(entityData)}</Tile.Text>}
        {'sample_category' in entityData && <Tile.Text>{entityData.sample_category}</Tile.Text>}
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
      {thumbnail_file && (
        <EntityTileThumbnail
          thumbnailDimension={thumbnailDimension}
          id={id}
          thumbnail_file={thumbnail_file}
          entity_type={entity_type}
        />
      )}
    </BodyWrapper>
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
