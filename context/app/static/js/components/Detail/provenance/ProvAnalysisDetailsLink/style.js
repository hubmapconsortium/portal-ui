import styled from 'styled-components';
import LaunchRoundedIcon from '@material-ui/icons/LaunchRounded';
import Divider from '@material-ui/core/Divider';

import { LightBlueLink } from 'js/shared-styles/Links';

const CwlIcon = styled(LaunchRoundedIcon)`
  margin-left: ${(props) => props.theme.spacing(0.5)}px;
  font-size: 1rem;
  align-self: center;
`;

const FlexLightBlueLink = styled(LightBlueLink)`
  display: flex;
`;

const PrimaryTextDivider = styled(Divider)`
  margin-left: ${(props) => props.theme.spacing(0.5)}px;
  margin-right: ${(props) => props.theme.spacing(0.5)}px;
  height: 15px;
  background-color: ${(props) => props.theme.palette.text.primary};
  align-self: center;
`;

const StyledListItem = styled.li`
  display: flex;
`;

export { CwlIcon, FlexLightBlueLink, PrimaryTextDivider, StyledListItem };
