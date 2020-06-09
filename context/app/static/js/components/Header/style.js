import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Logo from './hubmap_logo.svg';

const StyledAppBar = styled(AppBar)`
  margin-bottom: 16px;
`;

const HubmapLogo = styled(Logo)`
  margin-right: 10px;
  fill: #fff;
  height: 20px;
`;

const Title = styled(Typography)`
  flex-grow: 1;
`;

export { StyledAppBar, HubmapLogo, Title };
