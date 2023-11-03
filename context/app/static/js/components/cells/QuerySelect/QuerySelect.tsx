import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

import { queryTypes } from 'js/components/cells/queryTypes';
import { capitalizeString } from 'js/helpers/functions';
import { StyledTextField } from './style';
import { useQuerySelect } from './hooks';

interface QuerySelectProps {
  setParametersButtonRef: React.RefObject<HTMLButtonElement>;
}

function QuerySelect({ setParametersButtonRef }: QuerySelectProps) {
  const { selectedQueryType, handleSelect, handleButtonClick } = useQuerySelect();
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
