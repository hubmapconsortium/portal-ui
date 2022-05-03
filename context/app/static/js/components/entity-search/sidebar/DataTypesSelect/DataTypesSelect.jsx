import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import { StyledPaper } from './style';

function DataTypesSelect({ dataTypesToFieldsMap, handleToggleDataType, groups, handleToggleGroup }) {
  return (
    <StyledPaper>
      <FormControl component="fieldset">
        <FormGroup aria-label="data-types">
          {Object.keys(groups).map((group) => (
            <FormControlLabel
              value={group}
              control={<Checkbox color="primary" size="small" onClick={(event) => handleToggleGroup(event, group)} />}
              label={group}
            />
          ))}
          {Object.keys(dataTypesToFieldsMap).map((dataType) => (
            <FormControlLabel
              value={dataType}
              control={
                <Checkbox color="primary" size="small" onClick={(event) => handleToggleDataType(event, dataType)} />
              }
              label={dataType}
            />
          ))}
        </FormGroup>
      </FormControl>
    </StyledPaper>
  );
}

export default DataTypesSelect;
