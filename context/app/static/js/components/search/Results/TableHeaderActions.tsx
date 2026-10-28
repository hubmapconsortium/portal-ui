import React, { useMemo } from 'react';
import Stack from '@mui/material/Stack';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';

import WorkspacesDropdownMenu from 'js/components/workspaces/WorkspacesDropdownMenu';
import SaveEntitiesButtonFromSearch from 'js/components/savedLists/SaveEntitiesButtonFromSearch';
import BulkDownloadDialog from 'js/components/bulkDownload/BulkDownloadDialog';
import { useBulkDownloadStore } from 'js/stores/useBulkDownloadStore';
import { Copy } from 'js/shared-styles/tables/actions';
import { WhiteBackgroundIconTooltipButton } from 'js/shared-styles/buttons';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import { useDropdownMenuStore } from 'js/shared-styles/dropdowns/DropdownMenuProvider';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import { StyledDropdownMenuButton } from 'js/shared-styles/dropdowns/DropdownMenuButton/DropdownMenuButton';
import { useLineUpModalStore } from 'js/stores/useLineUpModalStore';
import { useSearchStore } from '../store';
import { isDevSearch, isFileSearch } from '../utils';
import { DefaultSearchViewSwitch } from '../SearchViewSwitch';
import { DownloadTSVItem } from '../MetadataMenu/DownloadTSVItem';
import { useSearchResultsQuery } from '../MetadataMenu/useSharedEntityLogic';
import { StyledMenuItem } from '../MetadataMenu/style';
import { trackEvent } from 'js/helpers/trackers';
import { ESEntityType } from 'js/components/types';

const entityTypeMap: Record<string, ESEntityType | undefined> = {
  donors: 'Donor',
  samples: 'Sample',
  datasets: 'Dataset',
  entities: undefined,
};

function useEntityQueryParams(lcPluralType: string) {
  const { selectedRows } = useSelectableTableStore();
  const filtersQuery = useSearchResultsQuery();

  const entityType = entityTypeMap[lcPluralType];

  return useMemo(() => {
    const uuids = selectedRows.size > 0 ? Array.from(selectedRows) : undefined;
    return uuids ? { uuids, entityType } : { entityType, filters: filtersQuery };
  }, [selectedRows, entityType, filtersQuery]);
}

function LineupButton({ lcPluralType }: { lcPluralType: string }) {
  const { open } = useLineUpModalStore();
  const queryParams = useEntityQueryParams(lcPluralType);
  const analyticsCategory = useSearchStore((state) => state.analyticsCategory);

  const handleClick = () => {
    open(queryParams);
    trackEvent({
      category: analyticsCategory,
      action: `Visualize ${lcPluralType} in LineUp`,
    });
  };

  return (
    <WhiteBackgroundIconTooltipButton onClick={handleClick} tooltip={`Visualize ${lcPluralType}' metadata in Lineup.`}>
      <AnalyticsRoundedIcon color="primary" />
    </WhiteBackgroundIconTooltipButton>
  );
}

function DownloadDatasetsItem({ type }: { type: string }) {
  const { selectedRows } = useSelectableTableStore();
  const { openDialog } = useBulkDownloadStore();
  const { closeMenu } = useDropdownMenuStore();
  const isDatasetSearch = type.toLowerCase() === 'dataset';
  const disabled = selectedRows.size === 0;

  if (!isDatasetSearch) return null;

  const handleClick = () => {
    openDialog(selectedRows);
    closeMenu();
  };

  return (
    <StyledMenuItem
      onClick={handleClick}
      disabled={disabled}
      tooltip={disabled ? 'Select datasets for download.' : 'Bulk download files for selected datasets.'}
    >
      Download Datasets
    </StyledMenuItem>
  );
}

const downloadMenuID = 'download-menu';

function DownloadMenuInner({ type, lcPluralType }: { type: string; lcPluralType: string }) {
  const { isOpen } = useBulkDownloadStore();
  const { deselectRows } = useSelectableTableStore();

  return (
    <>
      <StyledDropdownMenuButton variant="outlined" menuID={downloadMenuID}>
        Download
      </StyledDropdownMenuButton>
      <DropdownMenu id={downloadMenuID}>
        <DownloadTSVItem lcPluralType={lcPluralType} />
        <DownloadDatasetsItem type={type} />
      </DropdownMenu>
      {isOpen && <BulkDownloadDialog deselectRows={deselectRows} />}
    </>
  );
}

const DownloadMenu = withDropdownMenuProvider(DownloadMenuInner, false);

function TableHeaderActions() {
  const type = useSearchStore((state) => state.type);
  const devSearch = isDevSearch(type);
  // Files aren't entities: no detail page, saved lists, workspaces or LineUp metadata.
  // (The files search renders its own actions bar, so this is a safety net.)
  const entityActions = !devSearch && !isFileSearch(type);
  const lcPluralType = devSearch ? 'entities' : `${type.toLowerCase()}s`;

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        flexWrap: 'nowrap',
        alignItems: 'center',
      }}
    >
      <Copy />
      {entityActions && (
        <>
          <SaveEntitiesButtonFromSearch entity_type={type} />
          <LineupButton lcPluralType={lcPluralType} />
          <WorkspacesDropdownMenu type={type} />
        </>
      )}
      <DownloadMenu type={type} lcPluralType={lcPluralType} />
      <DefaultSearchViewSwitch />
    </Stack>
  );
}

export default TableHeaderActions;
