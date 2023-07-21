import React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';

import DataTypesSelectCheckboxes from 'js/components/entity-search/sidebar/DataTypesSelectCheckboxes';
import { StyledPaper, StyledFormLabel } from './style';

function DataTypesSelect({
  groups,
  dataTypesToFieldsMap,
  handleToggleDataType,
  handleToggleGroup,
  selectedGroups,
  selectedDataTypes,
}) {
  return (
    <StyledPaper>
      <FormControl component="fieldset">
        <StyledFormLabel>Data Types</StyledFormLabel>
        <FormGroup aria-label="data-types">
          <DataTypesSelectCheckboxes
            values={Object.keys(groups)}
            eventHandler={handleToggleGroup}
            selectedValues={selectedGroups}
          />
          <DataTypesSelectCheckboxes
            values={Object.keys(dataTypesToFieldsMap)}
            eventHandler={handleToggleDataType}
            selectedValues={selectedDataTypes}
          />
        </FormGroup>
      </FormControl>
    </StyledPaper>
  );
}

export default DataTypesSelect;
