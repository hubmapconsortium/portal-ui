import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import PrimarySwitch from 'js/shared-styles/switches/PrimarySwitch';

interface LabeledPrimarySwitchProps {
  label?: React.ReactNode;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  ariaLabel: string;
  disabledLabel?: string;
  enabledLabel?: string;
}
export default function LabeledPrimarySwitch({
  label,
  checked,
  onChange,
  ariaLabel,
  disabledLabel = 'Disabled',
  enabledLabel = 'Enabled',
}: LabeledPrimarySwitchProps) {
  return (
    <Stack spacing={1} alignItems="start">
      {label && <Typography variant="subtitle2">{label}</Typography>}
      <Stack direction="row" component="label" alignItems="center">
        <Typography>{disabledLabel}</Typography>
        <PrimarySwitch checked={checked} onChange={onChange} inputProps={{ 'aria-label': ariaLabel }} />
        <Typography>{enabledLabel}</Typography>
      </Stack>
    </Stack>
  );
}
