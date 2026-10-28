import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Paper from '@mui/material/Paper';

const bannerHeight = 40;
const appBarHeight = 64;

const headerHeight = appBarHeight + bannerHeight;

// The header keeps the brand color in dark mode, where MUI would otherwise give the AppBar the dark surface.
const FixedHeightAppBar = styled(AppBar)(({ theme }) => ({
  height: appBarHeight,
  top: bannerHeight,
  backgroundColor: theme.palette.common.brand,
  backgroundImage: 'none',
  color: theme.palette.common.white,
}));

const FixedHeightBanner = styled(Paper)(({ theme }) => ({
  height: bannerHeight,
  backgroundColor: theme.palette.common.banner,
  backgroundImage: 'none',
  color: theme.palette.common.white,
  display: 'flex',
  position: 'sticky',
  justifyContent: 'center',
  alignItems: 'center',
  top: 0,
  zIndex: 1000,
}));

export { FixedHeightAppBar, FixedHeightBanner, headerHeight, bannerHeight };
