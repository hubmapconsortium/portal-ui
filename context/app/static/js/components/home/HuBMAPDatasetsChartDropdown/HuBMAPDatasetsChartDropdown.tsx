import React from 'react';

import { useEventCallback } from '@mui/material/utils';
import DropdownListbox from 'js/shared-styles/dropdowns/DropdownListbox';
import DropdownListboxOption from 'js/shared-styles/dropdowns/DropdownListboxOption';
import { trackEvent } from 'js/helpers/trackers';
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
  const handleSelectOnClick = useEventCallback(({ option, i }: { option: string; i: number }) => {
    trackEvent({
      category: 'Homepage',
      action: 'HubMAP Datasets Graph/Category Type',
      label: option,
    });
    setSelectedColorDataIndex({ i });
  });

  return (
    <DropdownListbox
      id="bar-fill-dropdown"
      buttonComponent={SelectionButton}
      optionComponent={DropdownListboxOption}
      selectedOptionIndex={selectedColorDataIndex}
      options={colorDataOptions}
      selectOnClick={handleSelectOnClick}
      getOptionLabel={(v) => v}
      buttonProps={{ variant: 'outlined', color: 'primary', fullWidth: true }}
    />
  );
}

export default HuBMAPDatasetsChartDropdown;
