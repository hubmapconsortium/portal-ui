import React from 'react';
import Chip from '@material-ui/core/Chip';

function FacetChip({ label, value, onDelete }) {
  return <Chip onDelete={onDelete} label={`${label} : ${value}`} variant="outlined" />;
}

export default FacetChip;
