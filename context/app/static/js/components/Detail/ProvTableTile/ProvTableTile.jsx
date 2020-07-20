import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import useEntityData from 'hooks/useEntityData';
import DetailContext from '../context';
import EntityTile from '../EntityTile';
import { DownIcon } from './style';

function ProvTableTile(props) {
  const { uuid, entity_type, id, isCurrentEntity, isSampleSibling, isFirstTile } = props;
  const { elasticsearchEndpoint } = useContext(DetailContext);

  // mapped fields are not included in ancestor object
  const entityData = useEntityData(uuid, elasticsearchEndpoint);

  return (
    <>
      {!isFirstTile && ((entity_type === 'Sample' && !isSampleSibling) || entity_type === 'Dataset') && <DownIcon />}
      {entityData && (
        <EntityTile
          uuid={uuid}
          entity_type={entity_type}
          id={id}
          isCurrentEntity={isCurrentEntity}
          entityData={entityData}
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
