import styled from 'styled-components';
import LaunchRoundedIcon from '@material-ui/icons/LaunchRounded';
import { LightBlueLink } from 'shared-styles/links';

const CwlIcon = styled(LaunchRoundedIcon)`
  margin-left: ${(props) => props.theme.spacing(0.5)}px;
  font-size: 1rem;
  align-self: center;
`;

const FlexLightBlueLink = styled(LightBlueLink)`
  display: flex;
`;

const StyledSpan = styled.span`
  margin-right: ${(props) => props.theme.spacing(0.5)}px;
`;

export { CwlIcon, FlexLightBlueLink, StyledSpan };
