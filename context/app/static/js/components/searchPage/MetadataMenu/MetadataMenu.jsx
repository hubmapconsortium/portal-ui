import React from 'react';
import ReactGA from 'react-ga';
import MenuItem from '@material-ui/core/MenuItem';

import useSearchViewStore from 'js/stores/useSearchViewStore';
import { createDownloadUrl } from 'js/helpers/functions';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import { useStore } from 'js/shared-styles/dropdowns/DropdownMenuProvider/store';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import { StyledDropdownMenuButton, StyledLink, StyledInfoIcon } from './style';

async function fetchAndDownload({ urlPath, allResultsUUIDs, closeMenu, analyticsCategory }) {
  const response = await fetch(urlPath, {
    method: 'POST',
    body: JSON.stringify({ uuids: allResultsUUIDs }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    console.error('Download failed', response);
    closeMenu();
    return;
  }
  const results = await response.blob();
  const name = response.headers.get('content-disposition').split('=')[1];
  const mime = response.headers.get('content-type');

  const downloadUrl = createDownloadUrl(results, mime);
  const tempLink = document.createElement('a');
  tempLink.href = downloadUrl;
  tempLink.download = name;
  tempLink.click();

  ReactGA.event({
    category: analyticsCategory,
    action: `Download ${mime}`,
    label: urlPath.split('/').pop(),
  });

  closeMenu();
}

function MetadataMenu({ type, analyticsCategory }) {
  const lcPluralType = `${type.toLowerCase()}s`;
  const allResultsUUIDs = useSearchViewStore((state) => state.allResultsUUIDs);

  const { closeMenu } = useStore();

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
        <MenuItem
          onClick={() =>
            fetchAndDownload({
              urlPath: `/metadata/v0/${lcPluralType}.tsv`,
              allResultsUUIDs,
              closeMenu,
              analyticsCategory,
            })
          }
        >
          Download
          <SecondaryBackgroundTooltip title="Download a TSV of the table metadata." placement="bottom-start">
            <StyledInfoIcon color="primary" />
          </SecondaryBackgroundTooltip>
        </MenuItem>
        <MenuItem
          onClick={() =>
            fetchAndDownload({
              urlPath: `/notebooks/${lcPluralType}.ipynb`,
              allResultsUUIDs,
              closeMenu,
              analyticsCategory,
            })
          }
        >
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
