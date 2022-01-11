import React from 'react';
import ReactGA from 'react-ga';
import { format } from 'date-fns';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import useSearchViewStore from 'js/stores/useSearchViewStore';
import { createDownloadUrl } from 'js/helpers/functions';
import useMenu from 'js/hooks/useMenu';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledMenuButton, StyledLink, StyledInfoIcon } from './style';

function MetadataMenu({ type, analyticsCategory }) {
  const lcPluralType = `${type.toLowerCase()}s`;
  const allResultsUUIDs = useSearchViewStore((state) => state.allResultsUUIDs);

  const { menuRef, menuIsOpen, closeMenu, openMenu } = useMenu(false);

  // eslint-disable-next-line consistent-return
  async function fetchAndDownloadTSV() {
    const response = await fetch(`/metadata/v0/${lcPluralType}.tsv`, {
      method: 'POST',
      body: JSON.stringify({ uuids: allResultsUUIDs }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      console.error('Metadata TSV Failed', response);
      return;
    }
    const results = await response.blob();

    const downloadUrl = createDownloadUrl(results, 'text/tab-separated-values');
    // need to create link to set file name
    const tempLink = document.createElement('a');
    tempLink.href = downloadUrl;
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    tempLink.download = `hubmap-${lcPluralType}-metadata-${timestamp}.tsv`;
    tempLink.click();

    ReactGA.event({
      category: analyticsCategory,
      action: `Download Metadata`,
      label: type,
    });
    closeMenu();
  }

  const menuID = 'metadata-menu';

  return (
    <>
      <StyledMenuButton onClick={openMenu} menuIsOpen={menuIsOpen} menuID={menuID} menuRef={menuRef}>
        Metadata
      </StyledMenuButton>
      <Menu
        anchorEl={menuRef.current}
        open={menuIsOpen}
        onClose={closeMenu}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        id={menuID}
      >
        <MenuItem>
          <StyledLink href={`/lineup/${lcPluralType}`}>Visualize</StyledLink>
          <SecondaryBackgroundTooltip title="Visualize all available metadata in Lineup." placement="bottom-start">
            <StyledInfoIcon color="primary" />
          </SecondaryBackgroundTooltip>
        </MenuItem>
        <MenuItem onClick={fetchAndDownloadTSV}>
          Download
          <SecondaryBackgroundTooltip title="Download a TSV of the table metadata." placement="bottom-start">
            <StyledInfoIcon color="primary" />
          </SecondaryBackgroundTooltip>
        </MenuItem>
      </Menu>
    </>
  );
}

export default MetadataMenu;
