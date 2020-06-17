import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { HubmapLogo, Spacer, HeaderButton, Link } from './style';
import Menu from '../Menu';
import ShowcaseDropdown from '../ShowcaseDropdown';
import LoginButton from '../LoginButton';

function Header() {
  const theme = useTheme();
  const dontDisplayMenu = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {!dontDisplayMenu && <Menu />}
          <a href="/">
            <HubmapLogo aria-label="HubMAP logo" />
          </a>
          {dontDisplayMenu && (
            <>
              <div>
                {['Donor', 'Sample', 'Dataset'].map((type) => (
                  <HeaderButton key={type}>
                    <Link href={`/search?entity_type[0]=${type}`}>{`${type}s`}</Link>
                  </HeaderButton>
                ))}
              </div>
              <Spacer />
              <ShowcaseDropdown />
              <Tooltip title="Explore HuBMAP data using the Common Coordinate Framework">
                <HeaderButton>
                  <Link href="/ccf-eui" target="_blank" rel="noopener noreferrer">
                    CCF
                  </Link>
                </HeaderButton>
              </Tooltip>
              <HeaderButton>
                <Link href="/help">Help</Link>
              </HeaderButton>
            </>
          )}
          {!dontDisplayMenu && <Spacer />}
          {/* eslint-disable-next-line no-undef */}
          <LoginButton isAuthenticated={isAuthenticated} />
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
