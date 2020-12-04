import styled from 'styled-components';
import Button from '@material-ui/core/Button';

import { ReactComponent as Logo } from 'images/hubmap-logo.svg';

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

export { HubmapLogo, Spacer, HeaderButton, FlexNoWrap };
