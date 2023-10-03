import React from 'react';
import Chip, { ChipProps } from '@mui/material/Chip';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

interface SelectableChipProps extends ChipProps {
  isSelected: boolean;
}

function SelectableChip({ isSelected, ...rest }: SelectableChipProps) {
  const selectedProps = isSelected
    ? {
        icon: <CheckRoundedIcon />,
        color: 'primary',
      }
    : {
        variant: 'outlined',
      };
  return <Chip {...selectedProps} {...rest} />;
}

export default SelectableChip;
