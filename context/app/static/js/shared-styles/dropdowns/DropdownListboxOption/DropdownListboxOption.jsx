import React from 'react';
import { FlexMenuItem, CheckIcon, StyledSpan } from './style';

function DropdownListboxOption(props) {
  const { children, selected, className, ...rest } = props;
  return (
    <FlexMenuItem className={className} selected={selected} {...rest} role="option">
      {selected && <CheckIcon color="primary" />}
      <StyledSpan isSelected={selected}>{children}</StyledSpan>
    </FlexMenuItem>
  );
}

export default DropdownListboxOption;
