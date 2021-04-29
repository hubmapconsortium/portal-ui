import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import useEntityData from 'js/hooks/useEntityData';
import useDescendantCounts from 'js/hooks/useDescendantCounts';
import EntityTile from 'js/components/entity-tile/EntityTile';
import { AppContext } from 'js/components/Providers';
import ProvTableDerivedLink from '../ProvTableDerivedLink';
import { DownIcon } from './style';

function ProvTableTile(props) {
  const { uuid, entity_type, id, isCurrentEntity, isSampleSibling, isFirstTile, isLastTile } = props;
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);

  // mapped fields are not included in ancestor object
  const entityData = useEntityData(uuid, elasticsearchEndpoint, nexusToken);

  const allDescendantCounts = useDescendantCounts(entityData, ['Sample', 'Dataset', 'Support']);

  const displayDescendantCounts =
    // "Support" could be added here if we wanted to publicize it.
    entity_type === 'Donor' ? allDescendantCounts : { Dataset: allDescendantCounts.Dataset };

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
          descendantCounts={displayDescendantCounts}
        />
      )}
      {isLastTile && entity_type !== 'Donor' && allDescendantCounts[entity_type] > 0 && (
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
