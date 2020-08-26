import styled from 'styled-components';
import Button from '@material-ui/core/Button';

import Logo from 'images/hubmap-logo.svg';

const HubmapLogo = styled(Logo)`
  margin-right: 10px;
  fill: #fff;
  height: 20px;
`;
const Spacer = styled.div`
  flex-grow: 1;
`;

const HeaderButton = styled(Button)`
  margin-left: 10px;
  color: #ffffff;
`;

export { HubmapLogo, Spacer, HeaderButton };
