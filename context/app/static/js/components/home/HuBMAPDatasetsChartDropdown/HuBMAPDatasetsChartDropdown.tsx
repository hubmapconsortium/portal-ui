import React from 'react';

import DropdownListbox from 'js/shared-styles/dropdowns/DropdownListbox';
import DropdownListboxOption from 'js/shared-styles/dropdowns/DropdownListboxOption';
import { SelectionButton } from './style';

interface DatasetsChartDropdownProps {
  colorDataOptions: string[];
  selectedColorDataIndex: number;
  setSelectedColorDataIndex: ({ i }: { i: number }) => void;
}

function HuBMAPDatasetsChartDropdown({
  colorDataOptions,
  selectedColorDataIndex,
  setSelectedColorDataIndex,
}: DatasetsChartDropdownProps) {
  return (
    <DropdownListbox
      id="bar-fill-dropdown"
      buttonComponent={SelectionButton}
      optionComponent={DropdownListboxOption}
      selectedOptionIndex={selectedColorDataIndex}
      options={colorDataOptions}
      selectOnClick={setSelectedColorDataIndex}
      getOptionLabel={(v) => v}
      buttonProps={{ variant: 'outlined', color: 'primary', fullWidth: true }}
    />
  );
}

export default HuBMAPDatasetsChartDropdown;
