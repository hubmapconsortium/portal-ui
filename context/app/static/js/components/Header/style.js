import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Logo from './hubmap_logo.svg';

const StyledAppBar = styled(AppBar)`
  margin-bottom: 16px;
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
`;

const Link = styled.a`
  color: #ffffff;
`;

export { StyledAppBar, HubmapLogo, Spacer, HeaderButton, Link };
