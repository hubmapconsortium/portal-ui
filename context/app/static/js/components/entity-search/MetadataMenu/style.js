import styled from 'styled-components';
import Link from '@material-ui/core/Link';
import MenuItem from '@material-ui/core/MenuItem';

import { InfoIcon } from 'js/shared-styles/icons';
import DropdownMenuButton from 'js/shared-styles/dropdowns/DropdownMenuButton';

const StyledDropdownMenuButton = styled(DropdownMenuButton)`
  margin: 0 ${(props) => props.theme.spacing(1)}px;
`;

const StyledLink = styled(Link)`
  &:hover {
    text-decoration: none;
  }
`;

const StyledInfoIcon = styled(InfoIcon)`
  font-size: 1rem;
  margin-left: ${(props) => props.theme.spacing(0.5)}px;
`;

const StyledMenuItem = styled(MenuItem)`
  display: flex;
  justify-content: space-between;
`;

export { StyledDropdownMenuButton, StyledLink, StyledInfoIcon, StyledMenuItem };
