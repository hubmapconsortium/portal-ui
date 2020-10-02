import React from 'react';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';

import { FixedHeightAppBar } from './style';

function HeaderAppBar(props) {
  const { children, elevation, anchorRef, shouldConstrainWidth } = props;

  return (
    <FixedHeightAppBar position="sticky" ref={anchorRef} elevation={elevation}>
      <Container maxWidth={shouldConstrainWidth ? 'lg' : false}>
        <Toolbar disableGutters>{children} </Toolbar>
      </Container>
    </FixedHeightAppBar>
  );
}

export default HeaderAppBar;
