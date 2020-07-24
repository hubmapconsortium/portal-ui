import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import useEntityData from 'hooks/useEntityData';
import EntityTile from 'components/entity-tile/EntityTile';
import DetailContext from '../context';
import { DownIcon } from './style';

function ProvTableTile(props) {
  const { uuid, entity_type, id, isCurrentEntity, isSampleSibling, isFirstTile } = props;
  const { elasticsearchEndpoint } = useContext(DetailContext);

  // mapped fields are not included in ancestor object
  const entityData = useEntityData(uuid, elasticsearchEndpoint);

  const types = entity_type === 'Donor' ? ['Sample', 'Dataset'] : ['Dataset'];

  const descendantCounts = useMemo(() => {
    if (entityData) {
      // use Map to preserve insertion order
      const counts = new Map();
      types.reduce((acc, type) => {
        acc[type] = entityData.descendants.filter((d) => d.entity_type === type).length;
        return acc;
      }, counts);
      return counts;
    }

    return {};
  }, [types, entityData]);

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
          descendantCounts={descendantCounts || {}}
        />
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
