import React from 'react';
// import { trackEvent } from 'js/helpers/trackers';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import postAndDownloadFile from 'js/helpers/postAndDownloadFile';
import { useAppContext } from 'js/components/Contexts';

import { NewWorkspaceDialogFromSelections } from 'js/components/workspaces/NewWorkspaceDialog';
import { StyledDropdownMenuButton, StyledLink, StyledInfoIcon, StyledMenuItem } from './style';
import { useMetadataMenu } from './hooks';

async function fetchAndDownload({ urlPath, selectedHits, closeMenu }) {
  await postAndDownloadFile({ url: urlPath, body: { uuids: [...selectedHits] } });

  /*
  trackEvent({
    category: analyticsCategory,
    action: `Download ${mime}`,
    label: urlPath.split('/').pop(),
  });
  */
  closeMenu();
}

function MetadataMenu({ entityType }) {
  const lcPluralType = `${entityType.toLowerCase()}s`;
  const { selectedHits, closeMenu } = useMetadataMenu(lcPluralType);
  const menuID = 'metadata-menu';

  const { isWorkspacesUser } = useAppContext();

  return (
    <>
      <StyledDropdownMenuButton menuID={menuID}>Metadata</StyledDropdownMenuButton>
      <DropdownMenu id={menuID}>
        <StyledMenuItem>
          <StyledLink href={`/lineup/${lcPluralType}`}>Visualize</StyledLink>
          <SecondaryBackgroundTooltip title="Visualize all available metadata in Lineup." placement="bottom-start">
            <StyledInfoIcon color="primary" />
          </SecondaryBackgroundTooltip>
        </StyledMenuItem>
        <StyledMenuItem
          onClick={() =>
            fetchAndDownload({
              urlPath: `/metadata/v0/${lcPluralType}.tsv`,
              selectedHits,
              closeMenu,
            })
          }
        >
          Download
          <SecondaryBackgroundTooltip title="Download a TSV of the table metadata." placement="bottom-start">
            <StyledInfoIcon color="primary" />
          </SecondaryBackgroundTooltip>
        </StyledMenuItem>
        {isWorkspacesUser && <NewWorkspaceDialogFromSelections />}
      </DropdownMenu>
    </>
  );
}

export default withDropdownMenuProvider(MetadataMenu, false);
