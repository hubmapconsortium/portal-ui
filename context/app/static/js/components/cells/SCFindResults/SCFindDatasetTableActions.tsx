import React, { useMemo } from 'react';
import Stack from '@mui/material/Stack';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';

import { Copy } from 'js/shared-styles/tables/actions';
import { useDownloadTSV } from 'js/hooks/useDownloadTSV';
import SaveEntitiesButtonFromSearch from 'js/components/savedLists/SaveEntitiesButtonFromSearch';
import WorkspacesDropdownMenu, { WorkspaceSearchDialogs } from 'js/components/workspaces/WorkspacesDropdownMenu';
import { WhiteBackgroundIconTooltipButton } from 'js/shared-styles/buttons';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { useLineUpModalStore } from 'js/stores/useLineUpModalStore';
import { useBulkDownloadStore } from 'js/stores/useBulkDownloadStore';
import BulkDownloadDialog from 'js/components/bulkDownload/BulkDownloadDialog';
import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import { useDropdownMenuStore } from 'js/shared-styles/dropdowns/DropdownMenuProvider';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import { StyledDropdownMenuButton } from 'js/shared-styles/dropdowns/DropdownMenuButton/DropdownMenuButton';
import { StyledMenuItem } from 'js/components/search/MetadataMenu/style';

const ENTITY_TYPE = 'Dataset';

function LineUpButton() {
  const { open } = useLineUpModalStore();
  const { selectedRows } = useSelectableTableStore();
  const disabled = selectedRows.size === 0;

  return (
    <WhiteBackgroundIconTooltipButton
      disabled={disabled}
      tooltip={
        disabled ? 'Select datasets to visualize in LineUp.' : "Visualize selected datasets' metadata in LineUp."
      }
      onClick={() => open({ uuids: Array.from(selectedRows), entityType: ENTITY_TYPE })}
    >
      <AnalyticsRoundedIcon color="primary" />
    </WhiteBackgroundIconTooltipButton>
  );
}

const downloadMenuID = 'scfind-datasets-download-menu';

/** Downloads a TSV of metadata for the selected datasets (mirrors the search table's action). */
function DownloadMetadataItem() {
  const { selectedRows } = useSelectableTableStore();
  const { closeMenu } = useDropdownMenuStore();
  const disabled = selectedRows.size === 0;

  // `selectedRows` is an immer Set mutated in place (add/delete/clear), so its reference can stay
  // the same across selection changes — keying the memo off it directly would keep a stale UUID
  // snapshot. Key off the serialized selection instead: this reflects the current selection while
  // staying referentially stable between renders, so useDownloadTSV's "reset on params change"
  // effect doesn't cancel an in-flight download on every render.
  const selectionKey = Array.from(selectedRows).join(',');
  const queryParams = useMemo(
    () => ({ uuids: selectionKey ? selectionKey.split(',') : [], entityType: ENTITY_TYPE }),
    [selectionKey],
  );
  const { initiateDownload, isLoading } = useDownloadTSV({
    lcPluralType: 'datasets',
    queryParams,
    analyticsCategory: 'scFind Datasets',
  });

  return (
    <StyledMenuItem
      disabled={disabled}
      isLoading={isLoading}
      tooltip={
        disabled ? 'Select datasets to download metadata.' : 'Download a TSV of metadata for the selected datasets.'
      }
      onClick={() => {
        initiateDownload();
        closeMenu();
      }}
    >
      Download Metadata
    </StyledMenuItem>
  );
}

function DownloadMenuInner() {
  const { selectedRows, deselectRows } = useSelectableTableStore();
  const { isOpen, openDialog } = useBulkDownloadStore();
  const { closeMenu } = useDropdownMenuStore();
  const disabled = selectedRows.size === 0;

  return (
    <>
      <StyledDropdownMenuButton variant="outlined" menuID={downloadMenuID}>
        Download
      </StyledDropdownMenuButton>
      <DropdownMenu id={downloadMenuID}>
        <DownloadMetadataItem />
        <StyledMenuItem
          disabled={disabled}
          tooltip={disabled ? 'Select datasets for download.' : 'Bulk download files for selected datasets.'}
          onClick={() => {
            openDialog(selectedRows);
            closeMenu();
          }}
        >
          Download Datasets
        </StyledMenuItem>
      </DropdownMenu>
      {isOpen && <BulkDownloadDialog deselectRows={deselectRows} />}
    </>
  );
}

const DownloadMenu = withDropdownMenuProvider(DownloadMenuInner, false);

/**
 * Table-actions toolbar for the scFind dataset result tables (cell type + gene detail pages) — the
 * same set as the main dataset search table (copy, save to list, LineUp, workspaces, download),
 * driven by the selected rows from the surrounding SelectableTableProvider with a fixed `Dataset`
 * entity type.
 */
export default function SCFindDatasetTableActions() {
  return (
    <Stack direction="row" spacing={1} flexWrap="nowrap" alignItems="center">
      <Copy />
      <SaveEntitiesButtonFromSearch entity_type={ENTITY_TYPE} />
      <LineUpButton />
      <WorkspacesDropdownMenu type={ENTITY_TYPE} />
      <DownloadMenu />
      {/* Workspace add/create dialogs aren't globally mounted, so render them here. */}
      <WorkspaceSearchDialogs />
    </Stack>
  );
}
