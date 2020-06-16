import React, { useReducer, useRef } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Paper from '@material-ui/core/Paper';

import HubmapLogo from '../hubmap_logo.svg';

import { useStyles } from '../styles';

export default function Header() {
  const [open, toggle] = useReducer((v) => !v, false);
  const anchorRef = useRef(null);

  const classes = useStyles();
  let loginLink = (
    <a href="/login" className="navLink">
      {' '}
      Login{' '}
    </a>
  );
  // eslint-disable-next-line no-undef
  if (isAuthenticated) {
    loginLink = (
      <a href="/logout" className="navLink">
        {' '}
        Logout{' '}
      </a>
    );
  }

  return (
    <AppBar className={classes.MuiAppBar} position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <a href="/">
            <HubmapLogo className={classes.hubmaptypeLight} aria-label="HubMAP logo" />
          </a>
          {['Donor', 'Sample', 'Dataset'].map((type) => (
            <Button key={type}>
              <a href={`/search?entity_type[0]=${type}`} className="navLink">{`${type}s`}</a>
            </Button>
          ))}

          <Typography variant="h5" className={classes.title} />

          <Button ref={anchorRef} onClick={toggle} style={{ color: 'white' }}>
            Showcases
            {open ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
          </Button>
          <Popper open={open} anchorEl={anchorRef.current} placement="bottom-start">
            <Paper>
              <ClickAwayListener onClickAway={toggle}>
                <MenuList id="showcase-options">
                  {['Spraggins'].map((showcaseName) => (
                    <MenuItem dense key={showcaseName}>
                      <a href={`/showcase/${showcaseName.toLowerCase()}`} className="navLinkDropDown">
                        {showcaseName}
                      </a>
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Popper>

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
          <Button>{loginLink}</Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
