import React, { ComponentProps } from 'react';

import EntityTile from 'js/components/entity-tile/EntityTile';
import { getTileDescendantCounts } from 'js/components/entity-tile/EntityTile/utils';
import ProvTableDerivedLink from '../ProvTableDerivedLink';
import { DownIcon } from './style';

interface ProvTableTileProps extends Omit<ComponentProps<typeof EntityTile>, 'descendantCounts'> {
  isCurrentEntity: boolean;
  isSampleSibling: boolean;
  isFirstTile: boolean;
  isLastTile: boolean;
}

function ProvTableTile({
  uuid,
  entity_type,
  entityData,
  isCurrentEntity,
  isSampleSibling,
  isFirstTile,
  isLastTile,
  ...rest
}: ProvTableTileProps) {
  const descendantCounts = entityData?.descendant_counts?.entity_type;
  const descendantCountsToDisplay = getTileDescendantCounts(entityData, entity_type);

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
      {isLastTile && entity_type !== 'Donor' && (descendantCounts?.[entity_type] ?? 0) > 0 && (
        <ProvTableDerivedLink uuid={uuid} type={entity_type} />
      )}
    </>
  );
}
export default ProvTableTile;
