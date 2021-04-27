import React from 'react';
import PropTypes from 'prop-types';

import EntityTileTopText from '../EntityTileTopText';
import { StyledDatasetIcon, StyledSampleIcon, StyledDonorIcon, FixedWidthFlex } from './style';

function EntityTileTop(props) {
  const { entity_type, id, entityData, invertColors } = props;
  const icons = {
    Donor: <StyledDonorIcon />,
    Sample: <StyledSampleIcon />,
    Dataset: <StyledDatasetIcon />,
  };
  return (
    <FixedWidthFlex $invertColors={invertColors}>
      {icons[entity_type] || <StyledDatasetIcon />}
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
