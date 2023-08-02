import styled from 'styled-components';
import AppBar from '@mui/material/AppBar';

const headerHeight = 64;

const FixedHeightAppBar = styled(AppBar)`
  height: ${headerHeight}px;
`;

export { FixedHeightAppBar, headerHeight };
