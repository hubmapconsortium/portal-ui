import React from 'react';

import EntityTileTopText from '../EntityTileTopText';

import { StyledDatasetIcon, StyledSampleIcon, StyledDonorIcon, FixedWidthFlex } from './style';

function EntityTileTop(props) {
  const { entity_type, id, invertColors, entityData } = props;

  return (
    <FixedWidthFlex>
      {entity_type === 'Dataset' && <StyledDatasetIcon $invertColors={invertColors} />}
      {entity_type === 'Donor' && <StyledDonorIcon $invertColors={invertColors} />}
      {entity_type === 'Sample' && <StyledSampleIcon $invertColors={invertColors} />}
      <EntityTileTopText entity_type={entity_type} id={id} invertColors={invertColors} entityData={entityData} />
    </FixedWidthFlex>
  );
}

export default EntityTileTop;
