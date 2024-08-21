import React, { ComponentProps } from 'react';

import { useEntityData } from 'js/hooks/useEntityData';
import EntityTile from 'js/components/entity-tile/EntityTile';
import { getTileDescendantCounts } from 'js/components/entity-tile/EntityTile/utils';
import { ErrorTile } from 'js/components/entity-tile/EntityTile/EntityTile';
import ProvTableDerivedLink from '../ProvTableDerivedLink';
import { DownIcon } from './style';

interface ProvTableTileProps extends Omit<ComponentProps<typeof EntityTile>, 'entityData' | 'descendantCounts'> {
  isCurrentEntity: boolean;
  isSampleSibling: boolean;
  isFirstTile: boolean;
  isLastTile: boolean;
}

const provTilesSource = [
  'descendant_counts',
  'mapped_data_types',
  'last_modified_timestamp',
  'origin_samples_unique_mapped_organs',
  'mapped_metadata',
  'sample_category',
  'origin_samples_unique_mapped_organs',
  'thumbnail_file',
];

function ProvTableTile({
  uuid,
  entity_type,
  isCurrentEntity,
  isSampleSibling,
  isFirstTile,
  isLastTile,
  ...rest
}: ProvTableTileProps) {
  // mapped fields are not included in ancestor object, so we need to fetch them separately
  const [entityData, isLoading] = useEntityData(uuid, provTilesSource);
  const descendantCounts = entityData?.descendant_counts?.entity_type;
  const descendantCountsToDisplay = getTileDescendantCounts(entityData, entity_type);

  if (!entityData && !isLoading) {
    // No entity data found for this tile and not loading = the entity failed to index
    return <ErrorTile entity_type={entity_type} id={rest.id} />;
  }

  return (
    <>
      {!isFirstTile && !isSampleSibling && entity_type !== 'Donor' && <DownIcon />}
      {entityData && (
        <EntityTile
          uuid={uuid}
          entity_type={entity_type}
          invertColors={isCurrentEntity}
          entityData={entityData}
          descendantCounts={descendantCountsToDisplay}
          {...rest}
        />
      )}
      {isLastTile && entity_type !== 'Donor' && descendantCounts?.[entity_type] > 0 && (
        <ProvTableDerivedLink uuid={uuid} type={entity_type} />
      )}
    </>
  );
}
export default ProvTableTile;
