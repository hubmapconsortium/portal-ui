import React from 'react';
import PropTypes from 'prop-types';

import EntityTileTopText from '../EntityTileTopText';
import { StyledDatasetIcon, StyledSampleIcon, StyledDonorIcon, FixedWidthFlex } from './style';

/**
 * Tile section displaying icon and entity metadata
 * @param {object} props
 * @param {string} props.entity_type type of entity (donor, sample, or dataset)
 * @param {string} props.id display id
 * @param {object} props.entityData entity data from search api.
 * @param {boolean} [props.invertColors] whether the colors should be inverted
 */
function EntityTileTop(props) {
  const { entity_type, id, entityData, invertColors } = props;

  return (
    <FixedWidthFlex $invertColors={invertColors}>
      {entity_type === 'Dataset' && <StyledDatasetIcon />}
      {entity_type === 'Donor' && <StyledDonorIcon />}
      {entity_type === 'Sample' && <StyledSampleIcon />}
      <EntityTileTopText entity_type={entity_type} id={id} entityData={entityData} invertColors={invertColors} />
    </FixedWidthFlex>
  );
}

EntityTileTop.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  entityData: PropTypes.object.isRequired,
  entity_type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  invertColors: PropTypes.bool,
};

EntityTileTop.defaultProps = {
  invertColors: false,
};

export default EntityTileTop;
