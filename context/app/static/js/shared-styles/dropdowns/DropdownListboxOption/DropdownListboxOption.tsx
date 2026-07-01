import React from 'react';
import { MenuItemProps } from '@mui/material/MenuItem';
import { FlexMenuItem, CheckIcon, StyledSpan } from './style';

function DropdownListboxOption({ children, selected, className, ...rest }: MenuItemProps) {
  return (
    <FlexMenuItem className={className} selected={selected} {...rest} role="option">
      {selected && <CheckIcon color="primary" />}
      <StyledSpan $isSelected={selected}>{children}</StyledSpan>
    </FlexMenuItem>
  );
}

export default DropdownListboxOption;
