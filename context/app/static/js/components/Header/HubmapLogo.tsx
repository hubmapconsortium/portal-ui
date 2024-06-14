import { styled } from '@mui/material/styles';

// This import doesn't work at test-time, so pull into a separate file,
// so it doesn't cause problems for other styled components.
import Logo from 'assets/svg/hubmap-logo.svg';

const HubmapLogo = styled(Logo)(({ theme }) => ({
  fill: theme.palette.white.main,
  height: 20,
  marginRight: 10,
}));

export default HubmapLogo;
