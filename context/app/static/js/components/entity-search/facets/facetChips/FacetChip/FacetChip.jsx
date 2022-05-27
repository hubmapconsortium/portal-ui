import React from 'react';

import { StyledChip } from './style';

function FacetChip({ label, value, onDelete }) {
  return <StyledChip onDelete={onDelete} label={`${label} : ${value}`} variant="outlined" />;
}

export default FacetChip;
