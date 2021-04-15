import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import { ReactComponent as Logo } from 'portal-images/hubmap-logo.svg';

const HubmapLogo = styled(Logo)`
  margin-right: 10px;
  fill: ${(props) => props.theme.palette.white.main};
  height: 20px;
`;
const Spacer = styled.div`
  flex-grow: 1;
`;

const HeaderButton = styled(Button)`
  margin-left: 10px;
  color: ${(props) => props.theme.palette.white.main};
`;

const FlexNoWrap = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;

const StyledDivider = styled(Divider)`
  margin: ${(props) => props.theme.spacing(0.5)}px 0px;
`;

export { HubmapLogo, Spacer, HeaderButton, FlexNoWrap, StyledDivider };
