import React from 'react';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';

import { FixedHeightAppBar } from './style';

function HeaderAppBar({ children, elevation, anchorRef, shouldConstrainWidth }) {
  return (
    <FixedHeightAppBar position="sticky" ref={anchorRef} elevation={elevation}>
      <Container maxWidth={shouldConstrainWidth ? 'lg' : false}>
        <Toolbar disableGutters>{children} </Toolbar>
      </Container>
    </FixedHeightAppBar>
  );
}

export default HeaderAppBar;
