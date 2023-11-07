import React from 'react';
import { trackEvent } from 'js/helpers/trackers';
import MenuItem from '@mui/material/MenuItem';
import Link from '@mui/material/Link';

import useSearchViewStore from 'js/stores/useSearchViewStore';
import postAndDownloadFile from 'js/helpers/postAndDownloadFile';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import { useAppContext } from 'js/components/Contexts';
import { NewWorkspaceDialogFromSelections } from 'js/components/workspaces/NewWorkspaceDialog';
import { useMetadataMenu } from 'js/components/entity-search/MetadataMenu/hooks';

import { StyledDropdownMenuButton, StyledInfoIcon } from './style';

async function fetchAndDownload({ urlPath, allResultsUUIDs, closeMenu, analyticsCategory }) {
  await postAndDownloadFile({ url: urlPath, body: { uuids: allResultsUUIDs } });

  trackEvent({
    category: analyticsCategory,
    action: `Download file`,
    label: urlPath.split('/').pop(),
  });

  closeMenu();
}

function MetadataMenu({ type, analyticsCategory }) {
  const lcPluralType = `${type.toLowerCase()}s`;
  const allResultsUUIDs = useSearchViewStore((state) => state.allResultsUUIDs);

  const { closeMenu } = useMetadataMenu();

  const { isWorkspacesUser } = useAppContext();

  const menuID = 'metadata-menu';

  return (
    <>
      <StyledDropdownMenuButton menuID={menuID}>Metadata</StyledDropdownMenuButton>
      <DropdownMenu id={menuID}>
        <MenuItem>
          <Link underline="none" href={`/lineup/${lcPluralType}`}>
            Visualize
          </Link>
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
        {isWorkspacesUser && <NewWorkspaceDialogFromSelections />}
      </DropdownMenu>
    </>
  );
}

export default withDropdownMenuProvider(MetadataMenu, false);
