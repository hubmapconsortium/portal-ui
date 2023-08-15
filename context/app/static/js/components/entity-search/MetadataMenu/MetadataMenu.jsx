import React from 'react';
// import { trackEvent } from 'js/helpers/trackers';

import SelectableTableProvider from 'js/shared-styles/tables/SelectableTableProvider/SelectableTableProvider';
import { useStore } from 'js/shared-styles/tables/SelectableTableProvider/store';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import CreateWorkspaceDialog from 'js/components/workspaces/CreateWorkspaceDialog';

import postAndDownloadFile from 'js/helpers/postAndDownloadFile';
import { StyledDropdownMenuButton, StyledLink, StyledInfoIcon, StyledMenuItem } from './style';
import { useMetadataMenu, useDatasetsAccessLevel } from './hooks';

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

function NotebookMenuItem(props) {
  return (
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
}

function MetadataMenu({ entityType, results }) {
  const lcPluralType = `${entityType.toLowerCase()}s`;
  const { selectedHits, createNotebook, closeMenu } = useMetadataMenu(lcPluralType);
  const menuID = 'metadata-menu';

  const { selectedRows } = useStore();
  const protectedRows = useDatasetsAccessLevel(selectedRows.size > 0 ? [...selectedRows] : []).datasets;
  const containsProtectedDataset = protectedRows.length > 0;
  // eslint-disable-next-line no-underscore-dangle
  const protectedHubmapIds = protectedRows.map((row) => row._source.hubmap_id).join(', ');

  const selectedRowsError = [];

  if (selectedRows.size > 10) {
    selectedRowsError.push({
      type: 'overLimit',
      message: `You have selected ${selectedRows.size} datasets. Workspaces currently only supports up to 10 datasets. Please unselect datasets.`,
    });
  }

  if (containsProtectedDataset) {
    selectedRowsError.push({
      type: 'protected',
      message: `You have selected ${protectedRows.length} protected datasets. Workspaces currently only supports published public datasets. Selected protected datasets are shown below.`,
    });
  }

  return (
    <SelectableTableProvider>
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
        <CreateWorkspaceDialog
          handleCreateWorkspace={createNotebook}
          buttonComponent={NotebookMenuItem}
          selectedRowsError={selectedRowsError}
          results={results}
          protectedHubmapIds={protectedHubmapIds}
        />
      </DropdownMenu>
    </SelectableTableProvider>
  );
}

export default withDropdownMenuProvider(MetadataMenu, false);
