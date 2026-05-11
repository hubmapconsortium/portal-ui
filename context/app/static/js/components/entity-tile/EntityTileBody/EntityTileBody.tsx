import React from 'react';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tile from 'js/shared-styles/tiles/Tile';
import EntityTileThumbnail from 'js/components/entity-tile/EntityTileThumbnail';
import { getOriginSamplesOrgan } from 'js/helpers/functions';
import { EntityWithType, isDataset, isDonor, isSample } from 'js/components/types';
import DonorAgeTooltip from 'js/shared-styles/tooltips/DonorAgeTooltip';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { Flex, StyledDiv, BodyWrapper } from './style';

const thumbnailDimension = 80;

interface EntityTileBodyProps {
  entity_type: string;
  id: string;
  invertColors?: boolean;
  entityData: EntityWithType;
}

function EntityTileBody({ entity_type, id, entityData, invertColors }: EntityTileBodyProps) {
  const isSuperseded = Boolean(entityData.next_revision_uuid);
  return (
    <BodyWrapper $thumbnailDimension={thumbnailDimension}>
      <StyledDiv>
        <Stack direction="row" gap={0.5} alignItems="center">
          <Tile.Title>{id}</Tile.Title>
          {isSuperseded && (
            <SecondaryBackgroundTooltip title="A newer revision of this entity exists. Use /browse/latest to navigate to it.">
              <Chip label="Superseded" size="small" color="warning" variant="outlined" data-testid="superseded-chip" />
            </SecondaryBackgroundTooltip>
          )}
        </Stack>
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
                <DonorAgeTooltip donorAge={entityData.mapped_metadata?.age_value}>
                  {entityData.mapped_metadata?.age_value} {entityData.mapped_metadata?.age_unit}
                </DonorAgeTooltip>
              </Tile.Text>
            </Flex>
            <Tile.Text>{(entityData.mapped_metadata?.race ?? []).join(', ')}</Tile.Text>
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
