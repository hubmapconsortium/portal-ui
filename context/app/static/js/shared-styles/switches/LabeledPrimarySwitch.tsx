import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import PrimarySwitch from 'js/shared-styles/switches/PrimarySwitch';
import { SwitchProps } from '@mui/material/Switch';
import InfoTextTooltip from '../tooltips/InfoTextTooltip';

interface LabeledPrimarySwitchProps extends Omit<SwitchProps, 'label'> {
  label?: React.ReactNode;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  ariaLabel: string;
  disabledLabel?: string;
  enabledLabel?: string;
  tooltip?: string;
}
export default function LabeledPrimarySwitch({
  label,
  checked,
  onChange,
  ariaLabel,
  disabledLabel = 'Disabled',
  enabledLabel = 'Enabled',
  sx,
  ...rest
}: LabeledPrimarySwitchProps) {
  const labelNode = label ? (
    <Typography variant="subtitle2" color={rest.disabled ? 'textDisabled' : undefined}>
      {label}
    </Typography>
  ) : null;
  const tooltipNode = rest.tooltip ? (
    <InfoTextTooltip tooltipTitle={rest.tooltip} infoIconSize="medium">
      {labelNode}
    </InfoTextTooltip>
  ) : null;
  const actualLabel = tooltipNode ?? labelNode;
  return (
    <Stack useFlexGap alignItems="start" sx={sx}>
      {actualLabel}
      <Stack direction="row" component="label" alignItems="center" mt={0}>
        <Typography>{disabledLabel}</Typography>
        <PrimarySwitch
          checked={checked}
          onChange={onChange}
          slotProps={{
            input: { 'aria-label': ariaLabel },
          }}
          {...rest}
        />
        <Typography>{enabledLabel}</Typography>
      </Stack>
    </Stack>
  );
}
