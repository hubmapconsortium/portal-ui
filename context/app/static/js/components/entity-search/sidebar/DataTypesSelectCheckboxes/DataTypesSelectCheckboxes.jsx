import React from 'react';
import Checkbox from '@mui/material/Checkbox';

import { StyledFormControlLabel } from './style';

function DataTypesSelectCheckboxes({ values, selectedValues, eventHandler }) {
  return values.map((value) => (
    <StyledFormControlLabel
      key={value}
      value={value}
      checked={value in selectedValues}
      control={<Checkbox size="small" onClick={(event) => eventHandler(event, value)} />}
      label={value}
      labelPlacement="start"
    />
  ));
}

export default DataTypesSelectCheckboxes;
