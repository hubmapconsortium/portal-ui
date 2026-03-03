import React, { useMemo } from 'react';
import MenuItem from '@mui/material/MenuItem';
import SvgIcon from '@mui/material/SvgIcon';
import ListItemIcon from '@mui/material/ListItemIcon';
import Download from '@mui/icons-material/Download';
import { useEventCallback } from '@mui/material/utils';

import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import { useBulkDownloadDialog } from 'js/components/bulkDownload/hooks';
import BulkDownloadDialog from 'js/components/bulkDownload/BulkDownloadDialog';
import { trackEvent } from 'js/helpers/trackers';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { StyledDropdownMenuButton } from 'js/shared-styles/dropdowns/DropdownMenuButton/DropdownMenuButton';
import { useDownloadTSV } from 'js/hooks/useDownloadTSV';
import { useGetRestrictedDatasets } from 'js/hooks/useRestrictedDatasets';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

const menuID = 'downloads-menu';

interface DownloadsDropdownMenuProps {
  type: string;
  analyticsCategory?: string;
  defaultUUIDs: string[];
}

function BulkDownloadMenuItem({ defaultUUIDs, analyticsCategory }: Omit<DownloadsDropdownMenuProps, 'type'>) {
  const { openDialog, isOpen } = useBulkDownloadDialog();
  const { selectedRows, deselectRows } = useSelectableTableStore();

  const actualSelection = useMemo(
    () => (selectedRows.size > 0 ? selectedRows : new Set(defaultUUIDs)),
    [selectedRows, defaultUUIDs],
  );

  const { restrictedRows, isLoading } = useGetRestrictedDatasets(actualSelection);

  const allRestricted = useMemo(() => {
    return actualSelection.size > 0 && !isLoading && actualSelection.size === restrictedRows.length;
  }, [actualSelection, restrictedRows, isLoading]);

  const onClick = useEventCallback(() => {
    if (analyticsCategory) {
      trackEvent({
        category: analyticsCategory,
        action: 'Open Bulk Download Dialog from Dropdown',
      });
    }
    openDialog(actualSelection);
  });

  const label = actualSelection.size === 1 ? 'Dataset' : 'Datasets';

  const menuItem = (
    <MenuItem onClick={onClick} disabled={allRestricted || isLoading}>
      <ListItemIcon>
        <Download fontSize="small" color="primary" />
      </ListItemIcon>
      Download {label}
    </MenuItem>
  );

  return (
    <>
      {allRestricted ? (
        <SecondaryBackgroundTooltip title="You do not have permission to download any of the selected datasets.">
          <span>{menuItem}</span>
        </SecondaryBackgroundTooltip>
      ) : (
        menuItem
      )}
      {isOpen && <BulkDownloadDialog deselectRows={deselectRows} />}
    </>
  );
}

function DownloadTSVMenuItem({
  lcPluralType,
  analyticsCategory,
  defaultUUIDs,
  type,
}: {
  lcPluralType: string;
  analyticsCategory?: string;
  defaultUUIDs: string[];
  type: string;
}) {
  const { selectedRows } = useSelectableTableStore();

  const uuids = useMemo(
    () => (selectedRows.size > 0 ? Array.from(selectedRows) : defaultUUIDs),
    [selectedRows, defaultUUIDs],
  );

  const { initiateDownload, isLoading } = useDownloadTSV({
    lcPluralType,
    uuids,
    analyticsCategory: analyticsCategory || 'DownloadsMenu',
  });

  return (
    <MenuItem onClick={initiateDownload} disabled={isLoading}>
      <ListItemIcon>
        <Download fontSize="small" color="primary" />
      </ListItemIcon>
      Download {type} Metadata
    </MenuItem>
  );
}

function DownloadsDropdownMenu({ type, analyticsCategory, defaultUUIDs }: DownloadsDropdownMenuProps) {
  const lcPluralType = type.toLowerCase() + 's';
  const isDatasetSearch = type.toLowerCase() === 'dataset';

  return (
    <>
      <StyledDropdownMenuButton menuID={menuID} variant="outlined">
        <SvgIcon component={Download} sx={{ mr: 1, fontSize: '1.25rem' }} />
        Download
      </StyledDropdownMenuButton>
      <DropdownMenu id={menuID}>
        {isDatasetSearch && <BulkDownloadMenuItem defaultUUIDs={defaultUUIDs} analyticsCategory={analyticsCategory} />}
        <DownloadTSVMenuItem
          lcPluralType={lcPluralType}
          type={type}
          analyticsCategory={analyticsCategory}
          defaultUUIDs={defaultUUIDs}
        />
      </DropdownMenu>
    </>
  );
}

export default withDropdownMenuProvider(DownloadsDropdownMenu, false);
