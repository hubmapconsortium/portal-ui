import React, { useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';

import { capitalizeString } from 'js/helpers/functions';
import { StyledTextField } from './style';

function QuerySelect({ setStepCompletedText }) {
  const [selectedQueryType, setSelectedQueryType] = useState('gene');

  function handleSelect(event) {
    setSelectedQueryType(event.target.value);
    setStepCompletedText(`${capitalizeString(event.target.value)} Query`);
  }
  return (
    <StyledTextField
      id="query-select"
      label="Query Type"
      value={selectedQueryType}
      onChange={handleSelect}
      variant="outlined"
      select
      fullWidth
      SelectProps={{
        MenuProps: {
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          getContentAnchorEl: null,
        },
      }}
    >
      <MenuItem value="gene">Gene</MenuItem>
      <MenuItem value="protein">Protein</MenuItem>
    </StyledTextField>
  );
}

export default QuerySelect;
