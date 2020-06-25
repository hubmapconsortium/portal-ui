import React, { useRef } from 'react';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { StyledAppBar, HubmapLogo, Spacer, HeaderButton, Link } from './style';
import Menu from '../Menu';
import ShowcaseDropdown from '../ShowcaseDropdown';
import LoginButton from '../LoginButton';

function Header() {
  const theme = useTheme();
  const shouldDisplayMenu = !useMediaQuery(theme.breakpoints.up('md'));
  const anchorRef = useRef(null);

  return (
    <StyledAppBar position="sticky" ref={anchorRef} elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {shouldDisplayMenu && <Menu anchorRef={anchorRef} />}
          <a href="/">
            <HubmapLogo aria-label="HubMAP logo" />
          </a>
          {!shouldDisplayMenu && (
            <>
              <div>
                {['Donor', 'Sample', 'Dataset'].map((type) => (
                  <HeaderButton key={type}>
                    <Link href={`/search?entity_type[0]=${type}`}>{`${type}s`}</Link>
                  </HeaderButton>
                ))}
                <HeaderButton>
                  <Link href="/collections">Collections</Link>
                </HeaderButton>
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
                <Link href="/docs">Documentation</Link>
              </HeaderButton>
            </>
          )}
          {shouldDisplayMenu && <Spacer />}
          {/* eslint-disable-next-line no-undef */}
          <LoginButton isAuthenticated={isAuthenticated} />
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
}

export default Header;
