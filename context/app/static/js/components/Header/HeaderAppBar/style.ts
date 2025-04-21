import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Paper from '@mui/material/Paper';

const bannerHeight = 40;
const appBarHeight = 64;

const headerHeight = appBarHeight + bannerHeight;

const FixedHeightAppBar = styled(AppBar)({
  height: appBarHeight,
  top: bannerHeight,
});

const FixedHeightBanner = styled(Paper)(({ theme }) => ({
  height: bannerHeight,
  backgroundColor: theme.palette.info.dark,
  color: theme.palette.white.main,
  display: 'flex',
  position: 'sticky',
  justifyContent: 'center',
  alignItems: 'center',
  top: 0,
  zIndex: 1000,
}));

export { FixedHeightAppBar, FixedHeightBanner, headerHeight, bannerHeight };
