import React from 'react';

import EntityTileTopText from '../EntityTileTopText';

import { StyledDatasetIcon, StyledSampleIcon, StyledDonorIcon, FixedWidthFlex } from './style';

function EntityTileTop(props) {
  const { entity_type, id, isCurrentEntity, entityData } = props;

  return (
    <FixedWidthFlex>
      {entity_type === 'Dataset' && <StyledDatasetIcon $isCurrentEntity={isCurrentEntity} />}
      {entity_type === 'Donor' && <StyledDonorIcon $isCurrentEntity={isCurrentEntity} />}
      {entity_type === 'Sample' && <StyledSampleIcon $isCurrentEntity={isCurrentEntity} />}
      <EntityTileTopText entity_type={entity_type} id={id} isCurrentEntity={isCurrentEntity} entityData={entityData} />
    </FixedWidthFlex>
  );
}

export default EntityTileTop;
