import styled from 'styled-components';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import Divider from '@mui/material/Divider';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';

const CwlIcon = styled(LaunchRoundedIcon)`
  margin-left: ${(props) => props.theme.spacing(0.5)};
  font-size: 1rem;
  align-self: center;
`;

const FlexOutboundLink = styled(OutboundLink)`
  display: flex;
`;

const PrimaryTextDivider = styled(Divider)`
  margin-left: ${(props) => props.theme.spacing(0.5)};
  margin-right: ${(props) => props.theme.spacing(0.5)};
  height: 15px;
  background-color: ${(props) => props.theme.palette.text.primary};
  align-self: center;
`;

const StyledListItem = styled.li`
  display: flex;
`;

export { CwlIcon, FlexOutboundLink, PrimaryTextDivider, StyledListItem };
