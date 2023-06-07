import styled from 'styled-components';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';

import { InfoIcon } from 'js/shared-styles/icons';
import DropdownMenuButton from 'js/shared-styles/dropdowns/DropdownMenuButton';

const StyledDropdownMenuButton = styled(DropdownMenuButton)`
  margin: 0 ${(props) => props.theme.spacing(1)};
`;

const StyledLink = styled(Link)`
  &:hover {
    text-decoration: none;
  }
`;

const StyledInfoIcon = styled(InfoIcon)`
  font-size: 1rem;
  margin-left: ${(props) => props.theme.spacing(0.5)};
`;

const StyledMenuItem = styled(MenuItem)`
  display: flex;
  justify-content: space-between;
`;

export { StyledDropdownMenuButton, StyledLink, StyledInfoIcon, StyledMenuItem };
