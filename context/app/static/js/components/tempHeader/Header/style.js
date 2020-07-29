import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
// eslint-disable-next-line import/no-unresolved
import Logo from 'images/hubmap-logo.svg';

const StyledAppBar = styled(AppBar)`
  margin-bottom: ${(props) => props.theme.spacing(2)}px;
`;

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

export { StyledAppBar, HubmapLogo, Spacer, HeaderButton };
