import { styled } from '@mui/material/styles';

import Logo from 'assets/svg/hubmap-logo.svg';

const HubmapLogo = styled(Logo)(({ theme }) => ({
  fill: theme.palette.white.main,
  height: 20,
  marginRight: 10,
}));

export default HubmapLogo;
