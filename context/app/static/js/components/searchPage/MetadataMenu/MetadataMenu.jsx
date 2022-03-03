import React from 'react';
import ReactGA from 'react-ga';
import { format } from 'date-fns';
import MenuItem from '@material-ui/core/MenuItem';

import useSearchViewStore from 'js/stores/useSearchViewStore';
import { createDownloadUrl } from 'js/helpers/functions';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import { useStore } from 'js/shared-styles/dropdowns/DropdownMenuProvider/store';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import { StyledDropdownMenuButton, StyledLink, StyledInfoIcon } from './style';

function MetadataMenu({ type, analyticsCategory }) {
  const lcPluralType = `${type.toLowerCase()}s`;
  const allResultsUUIDs = useSearchViewStore((state) => state.allResultsUUIDs);

  const { closeMenu } = useStore();
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
      closeMenu();
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

  async function fetchAndDownloadNotebook() {
    // TODO: Clean up the copy and paste if this is accepted.
    const response = await fetch(`/notebooks/${lcPluralType}.ipynb`, {
      method: 'POST',
      body: JSON.stringify({ uuids: allResultsUUIDs }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      console.error('Notebook Failed', response);
      closeMenu();
      return;
    }
    const results = await response.blob();

    // TODO: Can we get the MIME type from the response?
    const downloadUrl = createDownloadUrl(results, 'application/x-ipynb+json');
    // need to create link to set file name
    const tempLink = document.createElement('a');
    tempLink.href = downloadUrl;
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    tempLink.download = `hubmap-${lcPluralType}-notebook-${timestamp}.ipynb`;
    tempLink.click();

    ReactGA.event({
      category: analyticsCategory,
      action: `Download Notebook`,
      label: type,
    });

    closeMenu();
  }

  const menuID = 'metadata-menu';

  return (
    <>
      <StyledDropdownMenuButton menuID={menuID}>Metadata</StyledDropdownMenuButton>
      <DropdownMenu id={menuID}>
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
        <MenuItem onClick={fetchAndDownloadNotebook}>
          Notebook
          <SecondaryBackgroundTooltip
            title="Download a Notebook which demonstrates how to programmatically access metadata."
            placement="bottom-start"
          >
            <StyledInfoIcon color="primary" />
          </SecondaryBackgroundTooltip>
        </MenuItem>
      </DropdownMenu>
    </>
  );
}

export default withDropdownMenuProvider(MetadataMenu, false);
