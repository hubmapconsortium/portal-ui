import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import HubmapLogo from './hubmap_logo.svg';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { useStyles } from './styles';

export default function Header() {
  const classes = useStyles();
  let loginLink = <a href={"/login"} className="navLink"> Login </a>;
  if (isLoggedIn) {
    loginLink = <a href={"/logout"} className="navLink"> Logout </a>;
  }

  return (
    <AppBar className={classes.MuiAppBar} position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar>
          <a href={"/"}><HubmapLogo className={classes.hubmaptypeLight}/></a>
          <Typography variant="h5" className={classes.title}/>
          <Button>
            <a href={"/browse/donor"} className="navLink">
              Donors
            </a>
          </Button>
          <Button>
            <a href={"/browse/sample"} className="navLink">
              Samples
            </a>
          </Button>
          <Button>
            <a href={"/browse/dataset"} className="navLink">
              Assays
            </a>
          </Button>
          <Button>
            <a href={"/help"} className="navLink">
              Help
            </a>
          </Button>
          <Button>
            { loginLink }
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
