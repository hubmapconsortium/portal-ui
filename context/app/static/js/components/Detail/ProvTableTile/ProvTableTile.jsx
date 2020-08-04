import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import useEntityData from 'js/hooks/useEntityData';
import useDescendantCounts from 'js/hooks/useDescendantCounts';
import EntityTile from 'js/components/entity-tile/EntityTile';
import ProvTableDerivedLink from '../ProvTableDerivedLink';
import DetailContext from '../context';
import { DownIcon } from './style';

function ProvTableTile(props) {
  const { uuid, entity_type, id, isCurrentEntity, isSampleSibling, isFirstTile, isLastTile } = props;
  const { elasticsearchEndpoint } = useContext(DetailContext);

  // mapped fields are not included in ancestor object
  const entityData = useEntityData(uuid, elasticsearchEndpoint);

  const allDescendantCounts = useDescendantCounts(entityData, ['Sample', 'Dataset']);

  const displayDescendantCounts =
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
