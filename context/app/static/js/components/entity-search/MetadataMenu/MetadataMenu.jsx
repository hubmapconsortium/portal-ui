import React from 'react';
// import { trackEvent } from 'js/helpers/trackers';

import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider/store';
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

const errorHelper = {
  datasets: (rowCount) =>
    `You have selected ${rowCount} datasets. Workspaces currently only supports up to 10 datasets. Please unselect datasets.`,
  protectedDataset: (rows) =>
    `You have selected a protected dataset (${rows[0]._source.hubmap_id}). Workspaces currently only supports published public datasets. To remove protected datasets from this workspace creation, click the “Remove Protected Datasets” button below or return to the previous screen to manually remove those datasets.`,
  protectedDatasets: (rows) =>
    `You have selected ${rows.length} protected datasets. To remove protected datasets from this workspace creation, click the “Remove Protected Datasets” button below or return to the previous screen to manually remove those datasets.`,
};

function MetadataMenu({ entityType, results }) {
  const lcPluralType = `${entityType.toLowerCase()}s`;
  const { selectedHits, createNotebook, closeMenu } = useMetadataMenu(lcPluralType);
  const menuID = 'metadata-menu';

  const { selectedRows } = useSelectableTableStore();
  const protectedRows = useDatasetsAccessLevel(selectedRows.size > 0 ? [...selectedRows] : []).datasets;
  const containsProtectedDataset = protectedRows.length > 0;

  const errorMessages = [];

  if (selectedRows.size > 10) {
    errorMessages.push(errorHelper.datasets(selectedRows.size));
  }

  if (containsProtectedDataset) {
    if (protectedRows.length === 1) {
      errorMessages.push(errorHelper.protectedDataset(protectedRows));
    } else {
      errorMessages.push(errorHelper.protectedDatasets(protectedRows));
    }
  }

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
        <CreateWorkspaceDialog
          handleCreateWorkspace={createNotebook}
          buttonComponent={NotebookMenuItem}
          errorMessages={errorMessages}
          results={results}
          protectedRows={protectedRows}
        />
      </DropdownMenu>
    </>
  );
}

export default withDropdownMenuProvider(MetadataMenu, false);
