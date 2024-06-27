import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';

const headerHeight = 64;

const FixedHeightAppBar = styled(AppBar)({
  height: headerHeight,
});

export { FixedHeightAppBar, headerHeight };
