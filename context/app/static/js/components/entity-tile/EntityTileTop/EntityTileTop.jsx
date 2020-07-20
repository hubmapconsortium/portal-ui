import React from 'react';

import EntityTileTopText from '../EntityTileTopText';

import { StyledDatasetIcon, StyledSampleIcon, StyledDonorIcon, FixedWidthFlex } from './style';

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

export default EntityTileTop;
