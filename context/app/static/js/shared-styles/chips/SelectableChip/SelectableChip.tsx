import React from 'react';
import Chip, { ChipProps } from '@mui/material/Chip';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

type SelectableChipProps = Pick<ChipProps<'button'>, 'label' | 'onClick' | 'disabled'> & {
  isSelected: boolean;
};

function SelectableChip({ label, onClick, disabled, isSelected, ...rest }: SelectableChipProps) {
  return (
    <Chip
      label={label}
      clickable
      onClick={onClick}
      component="button"
      disabled={disabled}
      color={isSelected ? 'primary' : undefined}
      icon={isSelected ? <CheckRoundedIcon /> : undefined}
      variant={isSelected ? 'filled' : 'outlined'}
      sx={{
        px: isSelected ? 0 : 1.5,
      }}
      {...rest}
    />
  );
}

export default SelectableChip;
