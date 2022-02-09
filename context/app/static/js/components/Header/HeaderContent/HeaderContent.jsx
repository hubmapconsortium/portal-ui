import React from 'react';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Menu from '../Menu';
import ResourceLinks from '../ResourceLinks';
import Dropdown from '../Dropdown';
import LoginButton from '../LoginButton';
import AtlasToolsLinks from '../AtlasToolsLinks';
import OtherLinks from '../OtherLinks';
import { HubmapLogo, Spacer, HeaderButton, FlexNoWrap } from './style';

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
            <Dropdown title="Other">
              <OtherLinks />
            </Dropdown>
          </FlexNoWrap>
          <Spacer />

          {/*
              If this changes, remember to update Menu.jsx!
          */}

          <Dropdown title="Atlas & Tools">
            <AtlasToolsLinks />
          </Dropdown>
          <Dropdown title="Resources">
            <ResourceLinks />
          </Dropdown>
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
