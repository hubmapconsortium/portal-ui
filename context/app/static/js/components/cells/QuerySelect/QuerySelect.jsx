import React, { useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import { capitalizeString } from 'js/helpers/functions';
import { StyledTextField } from './style';

function QuerySelect({ setStepCompletedText, setQueryType }) {
  const [selectedQueryType, setSelectedQueryType] = useState('gene');

  function handleSelect(event) {
    setSelectedQueryType(event.target.value);
  }

  function handleButtonClick() {
    setStepCompletedText(`${capitalizeString(selectedQueryType)} Query`);
    setQueryType(selectedQueryType);
  }
  return (
    <div>
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
      <Button variant="contained" color="primary" onClick={handleButtonClick}>
        Set Parameters
      </Button>
    </div>
  );
}

export default QuerySelect;
