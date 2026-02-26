import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { bulkDownloadOptionsField, bulkDownloadMetadataField } from 'js/components/bulkDownload/bulkDownloadFormFields';
import useBulkDownloadToasts from 'js/components/bulkDownload/toastHooks';
import { ALL_BULK_DOWNLOAD_OPTIONS } from 'js/components/bulkDownload/constants';
import { BulkDownloadDataset, useBulkDownloadStore } from 'js/stores/useBulkDownloadStore';
import useSWR from 'swr';
import { fetchSearchData } from 'js/hooks/useSearchData';
import { useAppContext } from 'js/components/Contexts';
import { SearchHit } from 'js/typings/elasticsearch';
import { useRestrictedDatasetsForm } from 'js/hooks/useRestrictedDatasets';
import { createDownloadUrl } from 'js/helpers/functions';
import { checkAndDownloadFile, postAndDownloadFile } from 'js/helpers/download';
import { getIDsQuery } from 'js/helpers/queries';
import { restrictedDatasetsErrorMessage } from 'js/components/bulkDownload/bulkDownloadDatasetMessaging';
import { trackEvent } from 'js/helpers/trackers';

const schema = z
  .object({
    ...bulkDownloadOptionsField,
    ...bulkDownloadMetadataField,
  })
  .partial()
  .required({ bulkDownloadOptions: true });

export interface BulkDownloadFormTypes {
  bulkDownloadOptions: string[];
  bulkDownloadMetadata: boolean;
}

function useBulkDownloadForm() {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<BulkDownloadFormTypes>({
    defaultValues: {
      bulkDownloadOptions: ALL_BULK_DOWNLOAD_OPTIONS.map((option) => option.key),
      bulkDownloadMetadata: false,
    },
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  return {
    handleSubmit,
    setValue,
    control,
    errors,
    reset,
    trigger,
  };
}

const ES_BATCH_SIZE = 10_000;

function useBulkDownloadDialog(deselectRows?: (uuids: string[]) => void) {
  const { isOpen, uuids, open, close, setUuids, setDownloadSuccess } = useBulkDownloadStore();
  const { control, handleSubmit, errors, reset, trigger } = useBulkDownloadForm();
  const { toastErrorDownloadFile, toastSuccessDownloadFile } = useBulkDownloadToasts();
  const { elasticsearchEndpoint, groupsToken } = useAppContext();

  // Fetch datasets for the selected uuids, batching to stay within ES limits
  const sortedUuids = useMemo(() => [...uuids].sort(), [uuids]);
  const shouldFetch = sortedUuids.length > 0;

  const { data: searchHits = [], isLoading: isDatasetsLoading } = useSWR(
    shouldFetch ? ['bulk-download-datasets', sortedUuids] : null,
    async () => {
      const allUuids = [...uuids];
      const batches: string[][] = [];
      for (let i = 0; i < allUuids.length; i += ES_BATCH_SIZE) {
        batches.push(allUuids.slice(i, i + ES_BATCH_SIZE));
      }

      const results = await Promise.all(
        batches.map((batch) =>
          fetchSearchData<BulkDownloadDataset, unknown>(
            {
              query: getIDsQuery(batch),
              _source: ['hubmap_id', 'processing', 'uuid', 'processing_type'],
              size: batch.length,
            },
            elasticsearchEndpoint,
            groupsToken,
          ),
        ),
      );

      return results.flatMap((r) => (r.hits?.hits ?? []) as Required<SearchHit<BulkDownloadDataset>>[]);
    },
  );
  const datasets = searchHits.map(({ _source }) => _source);

  // Which options and datasets to show in the dialog
  const downloadOptions = useMemo(
    () =>
      ALL_BULK_DOWNLOAD_OPTIONS.map((option) => {
        const datasetsForOption = datasets.filter((dataset) => option.isIncluded(dataset));

        return {
          ...option,
          count: datasetsForOption.length,
          datasets: datasetsForOption,
        };
      }).filter((option) => option.count > 0),
    [datasets],
  );

  // Remove selected uuids from the list and deselect them in the table if needed
  const removeUuidsOrRows = useCallback(
    (uuidsToRemove: string[]) => {
      if (deselectRows) {
        deselectRows(uuidsToRemove);
      }
      setUuids(new Set([...uuids].filter((uuid) => !uuidsToRemove.includes(uuid))));
    },
    [deselectRows, setUuids, uuids],
  );

  const restrictedDatasetsFields = useRestrictedDatasetsForm({
    selectedRows: new Set(uuids),
    deselectRows: removeUuidsOrRows,
    restrictedDatasetsErrorMessage,
  });

  const downloadMetadata = useCallback(
    (datasetsToDownload: BulkDownloadDataset[]) => {
      postAndDownloadFile({
        url: '/metadata/v0/datasets.tsv',
        body: { uuids: datasetsToDownload.map((dataset) => dataset.uuid) },
        fileName: 'metadata.tsv',
      })
        .then(() => {
          toastSuccessDownloadFile('Metadata');
          trackEvent({
            category: 'Bulk Download',
            action: 'Bulk Download / Download Dataset Metadata',
            label: `${datasetsToDownload.length} datasets`,
          });
        })
        .catch((e) => {
          toastErrorDownloadFile('Metadata', () => {
            downloadMetadata(datasetsToDownload);
          });
          console.error(e);
        });
    },
    [toastSuccessDownloadFile, toastErrorDownloadFile],
  );

  const downloadManifest = useCallback(
    (datasetsToDownload: BulkDownloadDataset[]) => {
      const url = createDownloadUrl(
        `${datasetsToDownload.map((dataset) => dataset.hubmap_id).join(' /\n')} /`,
        'text/plain',
      );

      checkAndDownloadFile({ url, fileName: 'manifest.txt' })
        .then(() => {
          trackEvent({
            category: 'Bulk Download',
            action: 'Bulk Download / Download File Manifest',
            label: `${datasetsToDownload.length} datasets`,
          });
          setDownloadSuccess(true);
        })
        .catch((e) => {
          toastErrorDownloadFile('Manifest', () => {
            downloadManifest(datasetsToDownload);
          });
          console.error(e);
        });
    },
    [toastErrorDownloadFile, setDownloadSuccess],
  );

  const handleClose = useCallback(() => {
    reset();
    close();
  }, [close, reset]);

  const onSubmit = useCallback(
    ({ bulkDownloadOptions, bulkDownloadMetadata }: BulkDownloadFormTypes) => {
      const datasetsToDownload = downloadOptions
        .filter((option) => bulkDownloadOptions.includes(option.key))
        .flatMap((option) => option.datasets);

      if (bulkDownloadMetadata) {
        downloadMetadata(datasetsToDownload);
      }

      downloadManifest(datasetsToDownload);
      handleClose();
    },
    [handleClose, downloadOptions, downloadMetadata, downloadManifest],
  );

  const openDialog = useCallback(
    (initialUuids: Set<string>) => {
      setUuids(initialUuids);
      open();
    },
    [setUuids, open],
  );

  // Trigger error on initial load for required fields
  useEffect(() => {
    if (isOpen) {
      trigger('bulkDownloadOptions').catch((e) => {
        console.error(e);
      });
    }
  }, [isOpen, trigger]);

  return {
    ...restrictedDatasetsFields,
    isOpen,
    isLoading: isDatasetsLoading || restrictedDatasetsFields.isLoading,
    errors,
    control,
    downloadOptions,
    onSubmit,
    handleSubmit,
    handleClose,
    openDialog,
    downloadManifest,
    downloadMetadata,
  };
}

export { useBulkDownloadDialog };
