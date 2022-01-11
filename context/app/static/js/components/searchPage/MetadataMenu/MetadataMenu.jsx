import React, { useRef, useState } from 'react';
import ReactGA from 'react-ga';

import { format } from 'date-fns';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { InfoIcon } from 'js/shared-styles/icons';
import useSearchViewStore from 'js/stores/useSearchViewStore';
import { createDownloadUrl } from 'js/helpers/functions';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledButton, StyledLink } from './style';

function useMenu(initialState) {
  // TODO: Pull out into utilities.
  const menuAnchorEl = useRef(null);
  const [menuIsOpen, setMenuIsOpen] = useState(initialState || false);

  function openMenu() {
    setMenuIsOpen(true);
  }

  function closeMenu() {
    setMenuIsOpen(false);
  }

  return { menuAnchorEl, menuIsOpen, closeMenu, openMenu };
}

function MetadataMenu({ type, analyticsCategory }) {
  const lcPluralType = `${type.toLowerCase()}s`;
  const allResultsUUIDs = useSearchViewStore((state) => state.allResultsUUIDs);

  const { menuAnchorEl, menuIsOpen, closeMenu, openMenu } = useMenu(false);

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

  return (
    <>
      <StyledButton onClick={openMenu} variant="outlined" color="primary" id="metadata-button" ref={menuAnchorEl}>
        Metadata
      </StyledButton>
      <Menu
        anchorEl={menuAnchorEl.current}
        open={menuIsOpen}
        onClose={closeMenu}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MenuItem>
          <StyledLink href={`/lineup/${lcPluralType}`}>Visualize</StyledLink>
          <SecondaryBackgroundTooltip title="Visualize all available metadata in Lineup." placement="bottom-start">
            <InfoIcon color="primary" />
          </SecondaryBackgroundTooltip>
        </MenuItem>
        <MenuItem onClick={fetchAndDownloadTSV}>
          Download
          <SecondaryBackgroundTooltip title="Download a TSV of the table metadata." placement="bottom-start">
            <InfoIcon color="primary" />
          </SecondaryBackgroundTooltip>
        </MenuItem>
      </Menu>
    </>
  );
}

export default MetadataMenu;
