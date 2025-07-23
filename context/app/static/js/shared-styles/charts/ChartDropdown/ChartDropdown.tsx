import React, { useId } from 'react';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { SxProps } from '@mui/system';

import { useEventCallback } from '@mui/material/utils';
import { trackEvent } from 'js/helpers/trackers';

interface DatasetsChartDropdownProps<T extends string> {
  options: readonly T[];
  displayLabels?: Record<T, string>;
  value: T;
  label: string;
  onChange: (e: SelectChangeEvent<T>) => void;
  fullWidth?: boolean;
  category?: string;
  action?: string;
  sx?: SxProps;
}

function ChartDropdown<T extends string>({
  options,
  value,
  onChange,
  label,
  fullWidth,
  displayLabels = {} as Record<T, string>,
  category = 'Homepage',
  action = 'HubMAP Datasets Graph/Category Type',
  sx,
}: DatasetsChartDropdownProps<T>) {
  const id = useId();
  const labelId = `${id}-label`;
  const handleOnChange = useEventCallback((e: SelectChangeEvent<T>) => {
    const option = e.target.value as T;
    trackEvent({
      category,
      action,
      label: option,
    });
    onChange(e);
  });
  return (
    <FormControl fullWidth={fullWidth} sx={sx}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select id={id} label={label} labelId={labelId} value={value} onChange={handleOnChange} fullWidth={fullWidth}>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {displayLabels[option] ?? option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default ChartDropdown;
