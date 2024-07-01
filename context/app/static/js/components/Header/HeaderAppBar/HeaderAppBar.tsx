import React, { PropsWithChildren } from 'react';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';

import { FixedHeightAppBar } from './style';

interface HeaderAppBarProps extends PropsWithChildren {
  elevation: number;
  shouldConstrainWidth: boolean;
}

function HeaderAppBar({ children, elevation, shouldConstrainWidth }: HeaderAppBarProps) {
  return (
    <FixedHeightAppBar position="sticky" elevation={elevation}>
      <Container maxWidth={shouldConstrainWidth ? 'lg' : false}>
        <Toolbar disableGutters>{children}</Toolbar>
      </Container>
    </FixedHeightAppBar>
  );
}

export default HeaderAppBar;
