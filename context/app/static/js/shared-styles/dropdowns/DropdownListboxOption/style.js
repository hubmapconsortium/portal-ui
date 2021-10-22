import styled, { css } from 'styled-components';
import MenuItem from '@material-ui/core/MenuItem';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';

const iconSize = '1.25rem';

const FlexMenuItem = styled(MenuItem)`
  display: flex;
  ${(props) =>
    props.selected &&
    css`
      cursor: default;
    `};
`;

const CheckIcon = styled(CheckRoundedIcon)`
  font-size: ${iconSize};
  margin-right: ${(props) => props.theme.spacing(1)}px;
`;

const StyledSpan = styled.span`
  ${(props) => !props.isSelected && `padding-left: calc(${iconSize} + ${props.theme.spacing(1)}px)`};
  padding-right: ${(props) => `calc(${iconSize} + ${props.theme.spacing(1)}px)`};
`;

export { FlexMenuItem, CheckIcon, StyledSpan };
