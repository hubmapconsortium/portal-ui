import React from 'react';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { useAppContext } from 'js/components/Contexts';
import { DatasetIcon, SampleIcon, DonorIcon } from 'js/shared-styles/icons';
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

  const types = [
    {
      icon: DonorIcon,
      name: 'Donor',
    },
    {
      icon: SampleIcon,
      name: 'Sample',
    },
    {
      icon: DatasetIcon,
      name: 'Dataset',
    },
  ];

  return (
    <>
      {shouldDisplayMenu && <Menu anchorRef={anchorRef} />}
      <a href="/">
        <HubmapLogo aria-label="HubMAP logo" />
      </a>
      {!shouldDisplayMenu && (
        <>
          <FlexNoWrap>
            {types.map((type) => (
              <HeaderType>
                <div>
                  <StyledSvgIcon component={type.icon} />
                </div>
                <HeaderButton key={type.name} href={`/search?entity_type[0]=${type.name}`} component={Link}>
                  {`${type.name}s`}
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
