import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

import { queryTypes } from 'js/components/cells/queryTypes';
import { StyledTextField } from './style';
import { useQuerySelect } from './hooks';

interface QuerySelectProps {
  setParametersButtonRef: React.RefObject<HTMLButtonElement>;
}

function QuerySelect({ setParametersButtonRef }: QuerySelectProps) {
  const { queryType, handleSelect, handleButtonClick } = useQuerySelect();
  return (
    <div>
      <StyledTextField
        id="query-select"
        label="Query Type"
        value={queryType}
        onChange={handleSelect}
        variant="outlined"
        select
        fullWidth
      >
        {Object.values(queryTypes).map((type) => (
          <MenuItem value={type.value} key={type.value}>
            {type.label}
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
