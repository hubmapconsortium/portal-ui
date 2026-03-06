import React, { ComponentProps, PropsWithChildren } from 'react';
import { FlexMenuItem, CheckIcon, StyledSpan } from './style';

function DropdownListboxOption({
  children,
  selected,
  className,
  ...rest
}: PropsWithChildren<ComponentProps<typeof FlexMenuItem>>) {
  return (
    <FlexMenuItem className={className} selected={selected} {...rest} role="option">
      {selected && <CheckIcon color="primary" />}
      <StyledSpan $isSelected={selected}>{children}</StyledSpan>
    </FlexMenuItem>
  );
}

export default DropdownListboxOption;
