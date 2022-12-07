import React, { useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import { queryTypes } from 'js/components/cells/queryTypes';
import { capitalizeString } from 'js/helpers/functions';
import { StyledTextField } from './style';

function QuerySelect({ completeStep, setQueryType, setParametersButtonRef }) {
  const [selectedQueryType, setSelectedQueryType] = useState(queryTypes.gene.value);

  function handleSelect(event) {
    setSelectedQueryType(event.target.value);
  }

  function handleButtonClick() {
    completeStep(`${capitalizeString(selectedQueryType)} Query`);
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
        {Object.values(queryTypes).map((type) => (
          <MenuItem value={type.value} key={type.value}>
            {capitalizeString(type.value)}
          </MenuItem>
        ))}
      </StyledTextField>
      <Button variant="contained" color="primary" onClick={handleButtonClick} ref={setParametersButtonRef}>
        Set Parameters
      </Button>
    </div>
  );
}

export default QuerySelect;
