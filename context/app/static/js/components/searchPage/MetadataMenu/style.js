import styled from 'styled-components';
import Link from '@mui/material/Link';

import { InfoIcon } from 'js/shared-styles/icons';
import DropdownMenuButton from 'js/shared-styles/dropdowns/DropdownMenuButton';

const StyledDropdownMenuButton = styled(DropdownMenuButton)`
  margin: 0 ${(props) => props.theme.spacing(1)};
  height: 100%;
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

export { StyledDropdownMenuButton, StyledLink, StyledInfoIcon };
