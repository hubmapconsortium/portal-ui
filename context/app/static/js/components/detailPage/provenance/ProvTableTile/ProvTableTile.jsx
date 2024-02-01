import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import useEntityData from 'js/hooks/useEntityData';
import EntityTile from 'js/components/entity-tile/EntityTile';
import { getTileDescendantCounts } from 'js/components/entity-tile/EntityTile/utils';
import ProvTableDerivedLink from '../ProvTableDerivedLink';
import { DownIcon } from './style';

function ProvTableTile({ uuid, entity_type, id, isCurrentEntity, isSampleSibling, isFirstTile, isLastTile, ...rest }) {
  const [descendantCounts, setDescendantCounts] = useState({});
  const [descendantCountsToDisplay, setDescendantCountsToDisplay] = useState({});
  // mapped fields are not included in ancestor object
  const entityData = useEntityData(uuid);

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
          id={id}
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

ProvTableTile.propTypes = {
  uuid: PropTypes.string.isRequired,
  entity_type: PropTypes.string.isRequired,
  isCurrentEntity: PropTypes.bool.isRequired,
  isSampleSibling: PropTypes.bool.isRequired,
  isFirstTile: PropTypes.bool.isRequired,
};

export default ProvTableTile;
