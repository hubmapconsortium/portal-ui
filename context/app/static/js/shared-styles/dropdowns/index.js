import React from 'react';
import styled from 'styled-components';
import MenuItem from '@material-ui/core/MenuItem';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';

const iconSize = '1.25rem';

const FlexMenuItem = styled(MenuItem)`
  display: flex;
`;

const CheckIcon = styled(CheckRoundedIcon)`
  font-size: ${iconSize};
  margin-right: ${(props) => props.theme.spacing(1)}px;
`;

const StyledSpan = styled.span`
  ${(props) => !props.isSelected && `margin-left: calc(${iconSize} + ${props.theme.spacing(1)}px)`};
`;

function DropdownSelectItem(props) {
  const { children, isSelected, className } = props;
  return (
    <FlexMenuItem className={className}>
      {isSelected && <CheckIcon color="primary" />}
      <StyledSpan isSelected={isSelected}> {children}</StyledSpan>
    </FlexMenuItem>
  );
}

export { DropdownSelectItem };
