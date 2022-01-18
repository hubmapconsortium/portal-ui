import React from 'react';

import DropdownListbox from 'js/shared-styles/dropdowns/DropdownListbox';
import DropdownListboxOption from 'js/shared-styles/dropdowns/DropdownListboxOption';
import { SelectionButton } from './style';

function HuBMAPDatasetsChartDropdown({ colorDataOptions, selectedColorDataIndex, setSelectedColorDataIndex }) {
  return (
    <DropdownListbox
      id="bar-fill-dropdown"
      buttonComponent={SelectionButton}
      optionComponent={DropdownListboxOption}
      selectedOptionIndex={selectedColorDataIndex}
      options={colorDataOptions}
      selectOnClick={setSelectedColorDataIndex}
      getOptionLabel={(v) => v.name}
      buttonProps={{ variant: 'outlined', color: 'primary' }}
    />
  );
}

export default HuBMAPDatasetsChartDropdown;
