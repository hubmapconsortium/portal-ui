import React from 'react';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import { StyledAppBar, HubmapLogo, Title } from './style';

export default function Header() {
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
    <StyledAppBar position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <a href="/">
            <HubmapLogo aria-label="HubMAP logo" />
          </a>
          <Title variant="h5" />
          {['Donor', 'Sample', 'Dataset'].map((type) => (
            <Button key={type}>
              <a href={`/search?entity_type[0]=${type}`} className="navLink">{`${type}s`}</a>
            </Button>
          ))}
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
    </StyledAppBar>
  );
}
