import React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tile from 'js/shared-styles/tiles/Tile';
import EntityTileThumbnail from 'js/components/entity-tile/EntityTileThumbnail';
import { getOriginSamplesOrgan } from 'js/helpers/functions';
import { EntityWithType, isDataset, isDonor, isSample } from 'js/components/types';
import DonorAgeTooltip from 'js/shared-styles/tooltips/DonorAgeTooltip';
import {
  HuBMAPIdLabel,
  RetractedChip,
  ViewLatestVersionChip,
  getHuBMAPIdDisplayInfo,
} from 'js/components/search/Results/CellContent';
import { Flex, StyledDiv, BodyWrapper } from './style';

const thumbnailDimension = 80;

interface EntityTileBodyProps {
  entity_type: string;
  id: string;
  invertColors?: boolean;
  entityData: EntityWithType;
}

function EntityTileBody({ entity_type, id, entityData, invertColors }: EntityTileBodyProps) {
  const { isSuperseded, isRetracted, latestRevisionUrl } = getHuBMAPIdDisplayInfo(entityData);
  const isStale = isSuperseded || isRetracted;
  return (
    <BodyWrapper $thumbnailDimension={thumbnailDimension}>
      <StyledDiv>
        <Stack direction="column" gap={0.5} alignItems="flex-start">
          <Tile.Title>
            <Box component="span" sx={isStale ? { color: 'warning.main' } : undefined}>
              <HuBMAPIdLabel hubmapId={id} isSuperseded={isSuperseded} isRetracted={isRetracted} />
            </Box>
          </Tile.Title>
          {isSuperseded && latestRevisionUrl && (
            <ViewLatestVersionChip latestRevisionUrl={latestRevisionUrl} programmaticNavigation />
          )}
          {isRetracted && !isSuperseded && <RetractedChip />}
        </Stack>
        {'origin_samples_unique_mapped_organs' in entityData && (isSample(entityData) || isDataset(entityData)) && (
          <Tile.Text>{getOriginSamplesOrgan(entityData)}</Tile.Text>
        )}
        {'sample_category' in entityData && isSample(entityData) && <Tile.Text>{entityData.sample_category}</Tile.Text>}
        {'assay_display_name' in entityData && isDataset(entityData) && (
          <Tile.Text>{entityData.assay_display_name.join(', ')}</Tile.Text>
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
