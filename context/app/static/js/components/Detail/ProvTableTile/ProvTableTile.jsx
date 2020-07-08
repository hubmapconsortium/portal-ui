import React, { useContext } from 'react';

import useEntityData from 'hooks/useEntityData';
import DetailContext from '../context';
import EntityTile from '../EntityTile';

function ProvTableTile(props) {
  const { uuid, entityType, id, isCurrentEntity } = props;
  const { elasticsearchEndpoint } = useContext(DetailContext);

  const entityData = useEntityData(uuid, elasticsearchEndpoint);

  return (
    <EntityTile uuid={uuid} entityType={entityType} id={id} isCurrentEntity={isCurrentEntity} entityData={entityData} />
  );
}

export default ProvTableTile;
