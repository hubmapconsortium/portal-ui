import React, { useId } from 'react';

import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface DatasetsChartDropdownProps<T extends string> {
  options: readonly T[];
  value: T;
  label: string;
  onChange: (e: SelectChangeEvent<T>) => void;
  fullWidth?: boolean;
}

function ChartDropdown<T extends string>({
  options,
  value,
  onChange,
  label,
  fullWidth,
}: DatasetsChartDropdownProps<T>) {
  const id = useId();
  const labelId = `${id}-label`;
  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select id={id} label={label} labelId={labelId} value={value} onChange={onChange} fullWidth={fullWidth}>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default ChartDropdown;
