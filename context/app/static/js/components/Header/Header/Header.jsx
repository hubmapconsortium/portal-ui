import React, { useRef } from 'react';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import { useTheme } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { StyledAppBar, HubmapLogo, Spacer, HeaderButton } from './style';
import Menu from '../Menu';
import ShowcaseLinks from '../ShowcaseLinks';
import Dropdown from '../Dropdown';
import LoginButton from '../LoginButton';
import DocumentationLinks from '../DocumentationLinks';

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
                  <HeaderButton key={type} href={`/search?entity_type[0]=${type}`} component={Link}>
                    {`${type}s`}
                  </HeaderButton>
                ))}
                <HeaderButton component={Link} href="/collections">
                  Collections
                </HeaderButton>
              </div>
              <Spacer />
              <Dropdown title="Showcases" menuListId="showcase-options">
                <ShowcaseLinks />
              </Dropdown>
              <Tooltip title="Explore HuBMAP data using the Common Coordinate Framework">
                <HeaderButton component={Link} href="/ccf-eui">
                  CCF
                </HeaderButton>
              </Tooltip>
              <Dropdown title="Documentation" menuListId="documentation-options">
                <DocumentationLinks />
              </Dropdown>
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
