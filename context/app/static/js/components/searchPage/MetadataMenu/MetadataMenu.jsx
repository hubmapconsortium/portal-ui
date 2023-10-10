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
import { CreateWorkspaceWithDatasetsDialog } from 'js/components/workspaces/CreateWorkspaceDialog';
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

function WorkspaceMenuItem(props) {
  const { isWorkspacesUser } = useAppContext();
  return (
    <MenuItem {...props} disabled={!isWorkspacesUser}>
      Workspace
      <SecondaryBackgroundTooltip
        title="Create a new HuBMAP workspace and load the load the notebook into it."
        placement="bottom-start"
      >
        <StyledInfoIcon color="primary" />
      </SecondaryBackgroundTooltip>
    </MenuItem>
  );
}

function MetadataMenu({ type, analyticsCategory }) {
  const lcPluralType = `${type.toLowerCase()}s`;
  const allResultsUUIDs = useSearchViewStore((state) => state.allResultsUUIDs);

  const { createNotebook, selectedHits, closeMenu } = useMetadataMenu(lcPluralType);

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
        <MenuItem
          onClick={() =>
            fetchAndDownload({
              urlPath: `/notebooks/entities/${lcPluralType}.ipynb`,
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
        {isWorkspacesUser && (
          <CreateWorkspaceWithDatasetsDialog buttonComponent={WorkspaceMenuItem} createNotebook={createNotebook} />
        )}
      </DropdownMenu>
    </>
  );
}

export default withDropdownMenuProvider(MetadataMenu, false);
