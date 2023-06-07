import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { AppContext } from 'js/components/Providers';
import Menu from '../Menu';
import ResourceLinks from '../ResourceLinks';
import Dropdown from '../Dropdown';
import UserLinks from '../UserLinks';
import AtlasToolsLinks from '../AtlasToolsLinks';
import OtherLinks from '../OtherLinks';
import { Spacer, HeaderButton, FlexNoWrap } from './style';
import HubmapLogo from '../HubmapLogo';

function HeaderContent({ anchorRef }) {
  const theme = useTheme();
  const shouldDisplayMenu = !useMediaQuery(theme.breakpoints.up('md'));
  const { isAuthenticated, userEmail } = useContext(AppContext);
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
      <UserLinks isAuthenticated={isAuthenticated} userEmail={userEmail} />
    </>
  );
}

HeaderContent.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  anchorRef: PropTypes.object.isRequired,
};

export default HeaderContent;
