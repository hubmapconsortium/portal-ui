import React from 'react';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';

import { StyledAppBar } from './style';

function HeaderAppBar(props) {
  const { children, anchorRef } = props;

  return (
    <StyledAppBar position="sticky" ref={anchorRef} elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>{children} </Toolbar>
      </Container>
    </StyledAppBar>
  );
}

export default HeaderAppBar;
