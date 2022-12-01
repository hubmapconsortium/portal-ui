import React, { useCallback } from 'react';
// import { trackEvent } from 'js/helpers/trackers';

import { createDownloadUrl } from 'js/helpers/functions';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import { useStore } from 'js/shared-styles/dropdowns/DropdownMenuProvider/store';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import { useStore as useSelectedTableStore } from 'js/shared-styles/tables/SelectableTableProvider/store';
import CreateWorkspaceDialog from 'js/components/workspaces/CreateWorkspaceDialog';

import { StyledDropdownMenuButton, StyledLink, StyledInfoIcon, StyledMenuItem } from './style';

async function fetchAndDownload({ urlPath, selectedHits, closeMenu }) {
  const response = await fetch(urlPath, {
    method: 'POST',
    body: JSON.stringify({ uuids: [...selectedHits] }),
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

  /*
  trackEvent({
    category: analyticsCategory,
    action: `Download ${mime}`,
    label: urlPath.split('/').pop(),
  });
  */
  closeMenu();
}

const NotebookMenuItem = (props) => (
  <StyledMenuItem {...props}>
    Notebook
    <SecondaryBackgroundTooltip
      title="Download a Notebook which demonstrates how to programmatically access metadata."
      placement="bottom-start"
    >
      <StyledInfoIcon color="primary" />
    </SecondaryBackgroundTooltip>
  </StyledMenuItem>
);

function MetadataMenu({ entityType }) {
  const lcPluralType = `${entityType.toLowerCase()}s`;

  const { closeMenu } = useStore();

  const { selectedRows: selectedHits } = useSelectedTableStore();

  const createNotebook = useCallback(
    async ({ workspaceName }) => {
      const response = await fetch(`/notebooks/${lcPluralType}.ipynb`, {
        method: 'POST',
        body: JSON.stringify({ uuids: [...selectedHits], workspace_name: workspaceName }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        console.error('Create workspace failed', response);
        closeMenu();
      }

      const json = await response.json();
      const { workspace_id, notebook_path } = json;
      document.location = `/workspaces/${workspace_id}?notebook_path=${encodeURIComponent(notebook_path)}`;
    },
    [selectedHits, lcPluralType, closeMenu],
  );

  const menuID = 'metadata-menu';

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
        <CreateWorkspaceDialog handleCreateWorkspace={createNotebook} buttonComponent={NotebookMenuItem} />
      </DropdownMenu>
    </>
  );
}

export default withDropdownMenuProvider(MetadataMenu, false);
