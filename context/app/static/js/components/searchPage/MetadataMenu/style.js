import styled from 'styled-components';
import Link from '@material-ui/core/Link';

import { InfoIcon } from 'js/shared-styles/icons';
import MenuButton from 'js/shared-styles/dropdowns/MenuButton';

const StyledMenuButton = styled(MenuButton)`
  margin: 0 ${(props) => props.theme.spacing(1)}px;
  height: 100%;
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

export { StyledMenuButton, StyledLink, StyledInfoIcon };
