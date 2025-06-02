import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import PrimarySwitch from 'js/shared-styles/switches/PrimarySwitch';

interface LabeledPrimarySwitchProps {
  label?: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}
export default function LabeledPrimarySwitch({ label = 'Enable', checked, onChange }: LabeledPrimarySwitchProps) {
  return (
    <Stack spacing={1} alignItems="start">
      <Typography variant="subtitle2">{label}</Typography>
      <Stack direction="row" component="label" alignItems="center">
        <Typography variant="caption">Disabled</Typography>
        <PrimarySwitch checked={checked} onChange={onChange} />
        <Typography variant="caption">Enabled</Typography>
      </Stack>
    </Stack>
  );
}
