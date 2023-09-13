import React from 'react';
import PropTypes from 'prop-types';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { useAppContext } from 'js/components/Contexts';
import Menu from '../Menu';
import Dropdown from '../Dropdown';
import UserLinks from '../UserLinks';
import { AtlasToolsLinks, OtherLinks, ResourceLinks } from '../staticLinks';
import { Spacer, HeaderButton, FlexNoWrap, StyledSvgIcon } from './style';
import HubmapLogo from '../HubmapLogo';

function HeaderContent({ anchorRef }) {
  const theme = useTheme();
  const shouldDisplayMenu = !useMediaQuery(theme.breakpoints.up('md'));
  const { isAuthenticated, userEmail } = useAppContext();

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
              <HeaderButton
                key={type}
                href={`/search?entity_type[0]=${type}`}
                component={Link}
                startIcon={<StyledSvgIcon component={entityIconMap[type]} />}
              >
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
