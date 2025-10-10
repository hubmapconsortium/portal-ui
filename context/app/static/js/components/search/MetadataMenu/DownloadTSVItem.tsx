import React, { useState, useEffect } from 'react';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { useDownloadTable } from 'js/helpers/download';
import { useLineupEntities } from 'js/pages/LineUpPage/hooks';
import { useMetadataFieldDescriptions } from 'js/hooks/useUBKG';
import { StyledMenuItem } from './style';
import { useSharedEntityLogic, entitiesToTableData } from './useSharedEntityLogic';
import { useEventCallback } from '@mui/material/utils';

interface DownloadTSVItemProps {
  lcPluralType: string;
  analyticsCategory?: string;
}

export function DownloadTSVItem({ lcPluralType, analyticsCategory: _analyticsCategory }: DownloadTSVItemProps) {
  const { toastError } = useSnackbarActions();
  const [shouldFetchData, setShouldFetchData] = useState(false);

  const queryParams = useSharedEntityLogic(lcPluralType);
  const { data: metadataFieldDescriptions } = useMetadataFieldDescriptions();

  const { entities, allKeys, isLoading } = useLineupEntities({
    ...queryParams,
    shouldFetchData,
  });

  // Convert entities to table format for download
  const tableData = React.useMemo(() => {
    return entitiesToTableData(entities, allKeys, true, metadataFieldDescriptions, lcPluralType);
  }, [entities, allKeys, metadataFieldDescriptions, lcPluralType]);

  const downloadTable = useDownloadTable(tableData);

  const download = useEventCallback(() => {
    try {
      downloadTable();
    } catch (error) {
      toastError('Download failed.');
      console.error('Download failed', error);
    }
  });

  // Reset shouldFetchData when queryParams change to allow re-fetching with new params
  useEffect(() => {
    setShouldFetchData(false);
  }, [queryParams]);

  // Automatically trigger download when data is ready
  useEffect(() => {
    if (entities.length > 0) {
      download();
    }
  }, [entities, download]);

  const handleClick = useEventCallback(() => {
    // First click: trigger loading the data
    setShouldFetchData(true);

    // Subsequent clicks: if data is already loaded, trigger download
    if (entities.length > 0) {
      download();
    }
  });

  return (
    <StyledMenuItem
      onClick={handleClick}
      isLoading={isLoading}
      tooltip={`Download a TSV file of your selection. If no selection exists, all ${lcPluralType} will be downloaded.`}
    >
      Download
    </StyledMenuItem>
  );
}
