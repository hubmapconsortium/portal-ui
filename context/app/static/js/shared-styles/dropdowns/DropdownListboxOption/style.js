import styled, { css } from 'styled-components';
import MenuItem from '@mui/material/MenuItem';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

const iconSize = '1.25rem';

const FlexMenuItem = styled(MenuItem)`
  display: flex;
  ${(props) =>
    props.selected &&
    css`
      cursor: default;
    `};
  && {
    background-color: #fff;
  }

  &:hover,
  :focus {
    background-color: ${(props) => props.theme.palette.action.hover};
  }
`;

const CheckIcon = styled(CheckRoundedIcon)`
  font-size: ${iconSize};
  margin-right: ${(props) => props.theme.spacing(1)};
`;

const StyledSpan = styled.span`
  ${(props) => !props.isSelected && `padding-left: calc(${iconSize} + ${props.theme.spacing(1)})`};
`;

export { FlexMenuItem, CheckIcon, StyledSpan };
