import React from 'react';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { useAppContext } from 'js/components/Contexts';
import Menu from '../Menu';
import ResourceLinks from '../ResourceLinks';
import Dropdown from '../Dropdown';
import UserLinks from '../UserLinks';
import AtlasToolsLinks from '../AtlasToolsLinks';
import OtherLinks from '../OtherLinks';
import { Spacer, HeaderButton, FlexNoWrap, StyledSvgIcon, HeaderType } from './style';
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
              <HeaderType>
                <StyledSvgIcon component={entityIconMap[type]} />
                <HeaderButton key={type} href={`/search?entity_type[0]=${type}`} component={Link}>
                  {`${type}s`}
                </HeaderButton>
              </HeaderType>
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
