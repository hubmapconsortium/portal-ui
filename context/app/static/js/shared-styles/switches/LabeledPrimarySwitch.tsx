import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import PrimarySwitch from 'js/shared-styles/switches/PrimarySwitch';

interface LabeledPrimarySwitchProps {
  label?: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  ariaLabel: string;
}
export default function LabeledPrimarySwitch({ label, checked, onChange, ariaLabel }: LabeledPrimarySwitchProps) {
  return (
    <Stack spacing={1} alignItems="start">
      {label && <Typography variant="subtitle2">{label}</Typography>}
      <Stack direction="row" component="label" alignItems="center">
        <Typography>Disabled</Typography>
        <PrimarySwitch checked={checked} onChange={onChange} inputProps={{ 'aria-label': ariaLabel }} />
        <Typography>Enabled</Typography>
      </Stack>
    </Stack>
  );
}
