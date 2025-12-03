import React, { useState, useEffect } from 'react';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { useDownloadTable } from 'js/helpers/download';
import { useLineupEntities } from 'js/pages/LineUpPage/hooks';
import { useMetadataFieldDescriptions } from 'js/hooks/useUBKG';
import { StyledMenuItem } from './style';
import { useSharedEntityLogic, entitiesToTableData } from './useSharedEntityLogic';
import { useEventCallback } from '@mui/material/utils';
import { trackEvent } from 'js/helpers/trackers';

interface DownloadTSVItemProps {
  lcPluralType: string;
  analyticsCategory?: string;
}

export function DownloadTSVItem({ lcPluralType, analyticsCategory }: DownloadTSVItemProps) {
  const { toastError } = useSnackbarActions();
  const queryParams = useSharedEntityLogic(lcPluralType);

  // Since download is a multistep process (fetch data, format, download),
  // we use this state to track whether the user has initiated a download
  // to avoid automatic re-fetching when query params change
  const [hasClickedDownload, setHasClickedDownload] = useState(false);

  useEffect(() => {
    setHasClickedDownload(false);
  }, [queryParams]);

  const { data: metadataFieldDescriptions } = useMetadataFieldDescriptions();

  const { entities, allKeys, isLoading } = useLineupEntities({
    ...queryParams,
    shouldFetchData: hasClickedDownload,
  });

  // Convert entities to table format for download
  const { isReady: dataIsReady, ...tableData } = React.useMemo(() => {
    return entitiesToTableData(entities, allKeys, true, metadataFieldDescriptions, lcPluralType);
  }, [entities, allKeys, metadataFieldDescriptions, lcPluralType]);

  const downloadTable = useDownloadTable(tableData);

  const download = useEventCallback(() => {
    try {
      downloadTable();
      trackEvent({
        category: analyticsCategory || 'MetadataMenu',
        action: `Download ${lcPluralType} TSV`,
      });
    } catch (error) {
      toastError('Download failed.');
      console.error('Download failed', error);
      trackEvent({
        category: analyticsCategory || 'MetadataMenu',
        action: `Download ${lcPluralType} TSV failed`,
      });
    }
  });

  // Automatically trigger download when data is ready
  useEffect(() => {
    if (dataIsReady) {
      download();
    }
  }, [dataIsReady, download]);

  const handleClick = useEventCallback(() => {
    // First click: trigger loading the data
    setHasClickedDownload(true);

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
