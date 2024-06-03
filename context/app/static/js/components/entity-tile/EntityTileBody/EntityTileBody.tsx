import React from 'react';

import Tile from 'js/shared-styles/tiles/Tile';
import EntityTileThumbnail from 'js/components/entity-tile/EntityTileThumbnail';
import { getOriginSamplesOrgan } from 'js/helpers/functions';
import { Flex, StyledDiv, BodyWrapper } from './style';
import { EntityData } from '../EntityTile/types';

const thumbnailDimension = 80;

interface EntityTileBodyProps {
  entity_type: string;
  id: string;
  invertColors?: boolean;
  entityData: EntityData;
}

function EntityTileBody({ entity_type, id, entityData, invertColors }: EntityTileBodyProps) {
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
              <Tile.Text>{entityData.mapped_metadata?.sex}</Tile.Text>
              <Tile.Divider invertColors={invertColors} />
              <Tile.Text>
                {entityData.mapped_metadata?.age_value} {entityData.mapped_metadata?.age_unit}
              </Tile.Text>
            </Flex>
            <Tile.Text>{entityData.mapped_metadata?.race.join(', ')}</Tile.Text>
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

export default EntityTileBody;
