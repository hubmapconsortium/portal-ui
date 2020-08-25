import React from 'react';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';

function HeaderAppBar(props) {
  const { children, anchorRef } = props;

  return (
    <AppBar position="sticky" ref={anchorRef} elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>{children} </Toolbar>
      </Container>
    </AppBar>
  );
}

export default HeaderAppBar;
