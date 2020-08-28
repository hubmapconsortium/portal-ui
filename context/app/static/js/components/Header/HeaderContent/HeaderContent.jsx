import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import Link from '@material-ui/core/Link';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Menu from '../Menu';
import PreviewLinks from '../PreviewLinks';
import Dropdown from '../Dropdown';
import LoginButton from '../LoginButton';
import DocumentationLinks from '../DocumentationLinks';
import { HubmapLogo, Spacer, HeaderButton } from './style';

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
          <div>
            {['Donor', 'Sample', 'Dataset'].map((type) => (
              <HeaderButton key={type} href={`/search?entity_type[0]=${type}`} component={Link}>
                {`${type}s`}
              </HeaderButton>
            ))}
          </div>
          <Spacer />
          <Dropdown title="Previews" menuListId="preview-options">
            <PreviewLinks />
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
    </>
  );
}

HeaderContent.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  anchorRef: PropTypes.object.isRequired,
};

export default HeaderContent;
