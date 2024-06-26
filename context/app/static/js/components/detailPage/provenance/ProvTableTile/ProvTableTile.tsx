import React, { useState, useEffect, ComponentProps } from 'react';

import useEntityData from 'js/hooks/useEntityData';
import EntityTile from 'js/components/entity-tile/EntityTile';
import { getTileDescendantCounts } from 'js/components/entity-tile/EntityTile/utils';
import { Entity } from 'js/components/types';
import ProvTableDerivedLink from '../ProvTableDerivedLink';
import { DownIcon } from './style';

interface ProvTableTileProps extends Omit<ComponentProps<typeof EntityTile>, 'entityData' | 'descendantCounts'> {
  isCurrentEntity: boolean;
  isSampleSibling: boolean;
  isFirstTile: boolean;
  isLastTile: boolean;
}

function ProvTableTile({
  uuid,
  entity_type,
  isCurrentEntity,
  isSampleSibling,
  isFirstTile,
  isLastTile,
  ...rest
}: ProvTableTileProps) {
  const [descendantCounts, setDescendantCounts] = useState<Record<string, number>>({});
  const [descendantCountsToDisplay, setDescendantCountsToDisplay] = useState<Record<string, number>>({});
  // mapped fields are not included in ancestor object
  const entityData = useEntityData(uuid) as Entity;

  useEffect(() => {
    if (entityData?.descendant_counts) {
      setDescendantCounts(entityData.descendant_counts.entity_type);
      setDescendantCountsToDisplay(getTileDescendantCounts(entityData, entity_type));
    }
  }, [entityData, entity_type]);

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
