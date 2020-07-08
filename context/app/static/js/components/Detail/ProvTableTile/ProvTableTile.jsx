import React, { useContext } from 'react';

import useEntityData from 'hooks/useEntityData';
import DetailContext from '../context';
import EntityTile from '../EntityTile';
import { DownIcon } from './style';

function ProvTableTile(props) {
  const { uuid, entity_type, id, isCurrentEntity, isNotSibling } = props;
  const { elasticsearchEndpoint } = useContext(DetailContext);

  // mapped fields are not included in ancestor object
  const entityData = useEntityData(uuid, elasticsearchEndpoint);

  return (
    <>
      {entity_type === 'Sample' && isNotSibling && <DownIcon />}
      <EntityTile
        uuid={uuid}
        entity_type={entity_type}
        id={id}
        isCurrentEntity={isCurrentEntity}
        entityData={entityData}
      />
    </>
  );
}

export default ProvTableTile;
