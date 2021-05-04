import React from 'react';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Menu from '../Menu';
import PreviewLinks from '../PreviewLinks';
import Dropdown from '../Dropdown';
import LoginButton from '../LoginButton';
import CCFLinks from '../CCFLinks';
import DocumentationLinks from '../DocumentationLinks';
import DropdownLink from '../DropdownLink';
import { HubmapLogo, Spacer, HeaderButton, FlexNoWrap, StyledDivider } from './style';

function HeaderContent({ anchorRef }) {
  const theme = useTheme();
  const shouldDisplayMenu = !useMediaQuery(theme.breakpoints.up('md'));
  return (
    <>
      {shouldDisplayMenu && <Menu anchorRef={anchorRef} />}
      <a href="/">
        <HubmapLogo aria-label="HubMAP logo" />
      </a>
      {!shouldDisplayMenu && (
        <>
          <FlexNoWrap>
            {['Donor', 'Sample', 'Dataset'].map((type) => (
              <HeaderButton key={type} href={`/search?entity_type[0]=${type}`} component={Link}>
                {`${type}s`}
              </HeaderButton>
            ))}
            <HeaderButton component={Link} href="/collections">
              {/* TODO: Move this into the loop above when search works. */}
              Collections
            </HeaderButton>
          </FlexNoWrap>
          <Spacer />

          {/*
              If this changes, remember to update Menu.jsx!
          */}

          <Dropdown title="Previews" menuListId="preview-options">
            <PreviewLinks />
          </Dropdown>
          <Dropdown title="Atlas & Tools" menuListId="ccf-options">
            <CCFLinks />
            <StyledDivider />
            <DropdownLink href="https://azimuth.hubmapconsortium.org/">
              Azimuth: Reference-based single cell mapping
            </DropdownLink>
          </Dropdown>
          <Dropdown title="Documentation" menuListId="documentation-options">
            <DocumentationLinks />
          </Dropdown>
          <HeaderButton component={Link} href="/my-lists">
            My Lists
          </HeaderButton>
        </>
      )}
      {shouldDisplayMenu && <Spacer />}
      {/* eslint-disable-next-line no-undef */}
      <LoginButton isAuthenticated={isAuthenticated} user_email={user_email} />
    </>
  );
}

HeaderContent.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  anchorRef: PropTypes.object.isRequired,
};

export default HeaderContent;
