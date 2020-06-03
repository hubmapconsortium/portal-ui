import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import HubmapLogo from './hubmap_logo.svg';

import { useStyles } from './styles';

export default function Header() {
  const classes = useStyles();
  let loginLink = <a href="/login" className="navLink"> Login </a>;
  if (isAuthenticated) { // eslint-disable-line no-undef
    loginLink = <a href="/logout" className="navLink"> Logout </a>;
  }

  return (
    <AppBar className={classes.MuiAppBar} position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <a href="/"><HubmapLogo className={classes.hubmaptypeLight} aria-label="HubMAP logo" /></a>
          <Typography variant="h5" className={classes.title} />
          {['Donor', 'Sample', 'Dataset'].map((type) => <Button key={type}><a href={`/search?entity_type[0]=${type}`} className="navLink">{`${type}s`}</a></Button>) }
          <Tooltip title="Explore HuBMAP data using the Common Coordinate Framework">
            <Button>
              <a href="/ccf-eui" target="_blank" rel="noopener noreferrer" className="navLink">
                CCF
              </a>
            </Button>
          </Tooltip>
          <Button>
            <a href="/help" className="navLink">
              Help
            </a>
          </Button>
          <Button>
            {loginLink}
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
