import React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import PrimarySwitch from 'js/shared-styles/switches/PrimarySwitch';
import { SwitchProps } from '@mui/material/Switch';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import InfoTextTooltip from '../tooltips/InfoTextTooltip';

interface LabeledPrimarySwitchProps extends Omit<SwitchProps, 'label'> {
  label?: React.ReactNode;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  ariaLabel: string;
  disabledLabel?: string;
  enabledLabel?: string;
  tooltip?: string;
  labelVariant?: TypographyProps['variant'];
  /** Optional hover tooltips explaining each side of the toggle. */
  disabledTooltip?: string;
  enabledTooltip?: string;
  /** Prevent the on/off option labels from wrapping onto multiple lines. */
  noWrapOptionLabels?: boolean;
}
export default function LabeledPrimarySwitch({
  label,
  checked,
  onChange,
  ariaLabel,
  disabledLabel = 'Disabled',
  enabledLabel = 'Enabled',
  tooltip,
  disabledTooltip,
  enabledTooltip,
  noWrapOptionLabels = false,
  sx,
  labelVariant = 'subtitle2',
  ...rest
}: LabeledPrimarySwitchProps) {
  const labelNode = label ? (
    <Typography variant={labelVariant} color={rest.disabled ? 'textDisabled' : undefined}>
      {label}
    </Typography>
  ) : null;
  const tooltipNode =
    tooltip && labelNode ? (
      <InfoTextTooltip tooltipTitle={tooltip} infoIconSize="medium">
        {labelNode}
      </InfoTextTooltip>
    ) : null;
  const actualLabel = tooltipNode ?? labelNode;

  const optionLabelSx = noWrapOptionLabels ? { whiteSpace: 'nowrap' as const } : undefined;
  const renderOptionLabel = (text: React.ReactNode, optionTooltip?: string) => {
    const node = <Typography sx={optionLabelSx}>{text}</Typography>;
    return optionTooltip ? <SecondaryBackgroundTooltip title={optionTooltip}>{node}</SecondaryBackgroundTooltip> : node;
  };

  return (
    <Stack useFlexGap alignItems="start" sx={sx}>
      {actualLabel}
      <Stack direction="row" component="label" alignItems="center" mt={0}>
        {renderOptionLabel(disabledLabel, disabledTooltip)}
        <PrimarySwitch
          checked={checked}
          onChange={onChange}
          slotProps={{
            input: { 'aria-label': ariaLabel },
          }}
          {...rest}
        />
        {renderOptionLabel(enabledLabel, enabledTooltip)}
      </Stack>
    </Stack>
  );
}
