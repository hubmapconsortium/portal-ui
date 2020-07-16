import React, { useContext, useMemo } from 'react';

import useEntityData from 'hooks/useEntityData';
import EntityTile from 'components/entity-tile/EntityTile';
import DetailContext from '../context';
import { DownIcon } from './style';

function ProvTableTile(props) {
  const { uuid, entity_type, id, isCurrentEntity, isNotSibling } = props;
  const { elasticsearchEndpoint } = useContext(DetailContext);

  // mapped fields are not included in ancestor object
  const entityData = useEntityData(uuid, elasticsearchEndpoint);

  const types = entity_type === 'Donor' ? ['Sample', 'Dataset'] : ['Dataset'];

  const descendantCounts = useMemo(() => {
    if (entityData && entity_type !== 'Dataset') {
      // use Map to preserve insertion order
      const counts = new Map();
      types.reduce((acc, type) => {
        acc[type] = entityData.descendants.filter((d) => d.entity_type === type).length;
        return acc;
      }, counts);
      return counts;
    }

    return {};
  }, [entity_type, types, entityData]);

  return (
    <>
      {entity_type === 'Sample' && isNotSibling && <DownIcon />}
      {entityData && (
        <EntityTile
          uuid={uuid}
          entity_type={entity_type}
          id={id}
          isCurrentEntity={isCurrentEntity}
          entityData={entityData}
          descendantCounts={descendantCounts || {}}
        />
      )}
    </>
  );
}

export default ProvTableTile;
