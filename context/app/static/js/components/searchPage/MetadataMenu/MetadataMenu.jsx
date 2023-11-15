import React from 'react';
import { trackEvent } from 'js/helpers/trackers';
import MenuItem from '@mui/material/MenuItem';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';

import useSearchViewStore from 'js/stores/useSearchViewStore';
import postAndDownloadFile from 'js/helpers/postAndDownloadFile';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import { useAppContext } from 'js/components/Contexts';
import { NewWorkspaceDialogFromSelections } from 'js/components/workspaces/NewWorkspaceDialog';
import { useMetadataMenu } from 'js/components/entity-search/MetadataMenu/hooks';

import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import useSWRMutation from 'swr/mutation';
import LinearProgress from '@mui/material/LinearProgress';
import { StyledDropdownMenuButton, StyledInfoIcon } from './style';

async function fetchAndDownload({ urlPath, uuids, closeMenu, analyticsCategory }) {
  await postAndDownloadFile({ url: urlPath, body: { uuids } });

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

  const selectedRows = useSelectableTableStore((state) => state.selectedRows);

  const { isWorkspacesUser } = useAppContext();

  const menuID = 'metadata-menu';

  const { trigger, isMutating } = useSWRMutation(
    () => (selectedRows.size > 0 ? [...selectedRows] : allResultsUUIDs),
    (uuids) =>
      fetchAndDownload({
        urlPath: `/metadata/v0/${lcPluralType}.tsv`,
        uuids,
        closeMenu,
        analyticsCategory,
      }),
  );

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
        <MenuItem onClick={trigger}>
          <Stack direction="column" width="100%">
            <span>
              Download
              <SecondaryBackgroundTooltip title="Download a TSV of the table metadata." placement="bottom-start">
                <StyledInfoIcon color="primary" />
              </SecondaryBackgroundTooltip>
            </span>
            {isMutating && <LinearProgress />}
          </Stack>
        </MenuItem>
        {isWorkspacesUser && <NewWorkspaceDialogFromSelections />}
      </DropdownMenu>
    </>
  );
}

export default withDropdownMenuProvider(MetadataMenu, false);
