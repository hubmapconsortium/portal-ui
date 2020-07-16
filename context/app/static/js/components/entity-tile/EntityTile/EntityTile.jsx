import React from 'react';
import PropTypes from 'prop-types';

import EntityTileBottom from '../EntityTileBottom';
import EntityTileTop from '../EntityTileTop';
import { StyledPaper } from './style';

/**
 * Tile displaying entity data
 * @param {object} props
 * @param {string} props.uuid universally unique identifier
 * @param {string} props.entity_type type of entity (donor, sample, or dataset)
 * @param {string} props.id display id
 * @param {object} props.entityData entity data from search api.
 * @param {boolean} [props.invertColors] whether the colors should be inverted
 * @param {object} [props.descendantCounts] number of descendant entities as entries
 */
function EntityTile(props) {
  const { uuid, entity_type, id, invertColors, entityData, descendantCounts } = props;

  return (
    <a href={`/browse/${entity_type.toLowerCase()}/${uuid}`}>
      <StyledPaper $invertColors={invertColors}>
        <EntityTileTop entity_type={entity_type} id={id} invertColors={invertColors} entityData={entityData} />
        <EntityTileBottom invertColors={invertColors} entityData={entityData} descendantCounts={descendantCounts} />
      </StyledPaper>
    </a>
  );
}

EntityTile.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  entityData: PropTypes.object.isRequired,
  uuid: PropTypes.string.isRequired,
  entity_type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  descendantCounts: PropTypes.shape({ Dataset: PropTypes.number, Sample: PropTypes.number }),
  invertColors: PropTypes.bool,
};

EntityTile.defaultProps = {
  descendantCounts: {},
  invertColors: false,
};

export default EntityTile;
