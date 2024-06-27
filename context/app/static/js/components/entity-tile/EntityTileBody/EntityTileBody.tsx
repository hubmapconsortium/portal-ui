import React from 'react';

import Tile from 'js/shared-styles/tiles/Tile';
import EntityTileThumbnail from 'js/components/entity-tile/EntityTileThumbnail';
import { getOriginSamplesOrgan } from 'js/helpers/functions';
import { EntityWithType, isDataset, isDonor, isSample } from 'js/components/types';
import { Flex, StyledDiv, BodyWrapper } from './style';

const thumbnailDimension = 80;

interface EntityTileBodyProps {
  entity_type: string;
  id: string;
  invertColors?: boolean;
  entityData: EntityWithType;
}

function EntityTileBody({ entity_type, id, entityData, invertColors }: EntityTileBodyProps) {
  return (
    <BodyWrapper $thumbnailDimension={thumbnailDimension}>
      <StyledDiv>
        <Tile.Title>{id}</Tile.Title>
        {'origin_samples_unique_mapped_organs' in entityData && (isSample(entityData) || isDataset(entityData)) && (
          <Tile.Text>{getOriginSamplesOrgan(entityData)}</Tile.Text>
        )}
        {'sample_category' in entityData && isSample(entityData) && <Tile.Text>{entityData.sample_category}</Tile.Text>}
        {'mapped_data_types' in entityData && isDataset(entityData) && (
          <Tile.Text>{entityData.mapped_data_types.join(', ')}</Tile.Text>
        )}
        {entity_type === 'Donor' && 'mapped_metadata' in entityData && isDonor(entityData) && (
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
      {isDataset(entityData) && entityData.thumbnail_file && (
        <EntityTileThumbnail
          thumbnailDimension={thumbnailDimension}
          id={id}
          thumbnail_file={entityData.thumbnail_file}
          entity_type={entity_type}
        />
      )}
    </BodyWrapper>
  );
}

export default EntityTileBody;
