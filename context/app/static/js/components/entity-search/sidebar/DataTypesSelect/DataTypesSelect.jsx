import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';

import DataTypesSelectCheckboxes from 'js/components/entity-search/sidebar/DataTypesSelectCheckboxes';
import { StyledPaper } from './style';

function DataTypesSelect({
  dataTypesToFieldsMap,
  handleToggleDataType,
  groups,
  handleToggleGroup,
  selectedGroups,
  selectedDataTypes,
}) {
  return (
    <StyledPaper>
      <FormControl component="fieldset">
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
