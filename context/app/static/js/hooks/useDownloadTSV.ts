import { useState, useEffect, useMemo } from 'react';
import { useEventCallback } from '@mui/material/utils';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { useDownloadTable } from 'js/helpers/download';
import { useLineupEntities } from 'js/pages/LineUpPage/hooks';
import { useMetadataFieldDescriptions } from 'js/hooks/useUBKG';
import { trackEvent } from 'js/helpers/trackers';
import { entitiesToTableData } from 'js/components/search/MetadataMenu/useSharedEntityLogic';

interface UseDownloadTSVOptions {
  lcPluralType: string;
  uuids?: string[];
  queryParams?: Record<string, unknown>;
  analyticsCategory?: string;
  autoDownload?: boolean;
}

export function useDownloadTSV({
  lcPluralType,
  uuids,
  queryParams,
  analyticsCategory = 'Download',
  autoDownload = true,
}: UseDownloadTSVOptions) {
  const { toastError } = useSnackbarActions();
  const [hasClickedDownload, setHasClickedDownload] = useState(false);

  // Reset download state when dependencies change
  useEffect(() => {
    setHasClickedDownload(false);
  }, [uuids, queryParams]);

  const { data: metadataFieldDescriptions } = useMetadataFieldDescriptions();

  const { entities, allKeys, isLoading } = useLineupEntities({
    ...(queryParams || {}),
    ...(uuids ? { uuids } : {}),
    shouldFetchData: hasClickedDownload,
  });

  const { isReady: dataIsReady, ...tableData } = useMemo(() => {
    return entitiesToTableData(entities, allKeys, true, metadataFieldDescriptions, lcPluralType);
  }, [entities, allKeys, metadataFieldDescriptions, lcPluralType]);

  const downloadTable = useDownloadTable(tableData);

  const download = useEventCallback(() => {
    try {
      downloadTable();
      trackEvent({
        category: analyticsCategory,
        action: `Download ${lcPluralType} TSV`,
      });
    } catch (error) {
      toastError('Download failed.');
      console.error('Download failed', error);
      trackEvent({
        category: analyticsCategory,
        action: `Download ${lcPluralType} TSV failed`,
      });
    }
  });

  // Automatically trigger download when data is ready (if autoDownload is enabled)
  useEffect(() => {
    if (dataIsReady && autoDownload) {
      download();
    }
  }, [dataIsReady, download, autoDownload]);

  const initiateDownload = useEventCallback(() => {
    setHasClickedDownload(true);
    // If entities are already loaded, trigger download immediately
    if (entities.length > 0) {
      download();
    }
  });

  return {
    initiateDownload,
    download,
    isLoading,
    isReady: dataIsReady,
  };
}
