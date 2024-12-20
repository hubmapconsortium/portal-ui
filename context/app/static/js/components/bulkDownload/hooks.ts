import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { bulkDownloadOptionsField, bulkDownloadMetadataField } from 'js/components/bulkDownload/bulkDownloadFormFields';
import useBulkDownloadToasts from 'js/components/bulkDownload/toastHooks';
import { ALL_BULK_DOWNLOAD_OPTIONS } from 'js/components/bulkDownload/constants';
import { BulkDownloadDataset, useBulkDownloadStore } from 'js/stores/useBulkDownloadStore';
import { useSearchHits } from 'js/hooks/useSearchData';
import { useProtectedDatasetsForm } from 'js/hooks/useProtectedDatasets';
import { createDownloadUrl } from 'js/helpers/functions';
import { checkAndDownloadFile, postAndDownloadFile } from 'js/helpers/download';
import { trackEvent } from 'js/helpers/trackers';
import { getIDsQuery } from 'js/helpers/queries';

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
      bulkDownloadOptions: [],
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

function useBulkDownloadDialog(deselectRows?: (uuids: string[]) => void) {
  const { isOpen, uuids, open, close, setUuids, setDownloadSuccess } = useBulkDownloadStore();
  const { control, handleSubmit, errors, reset, trigger } = useBulkDownloadForm();
  const { toastErrorDownloadFile, toastSuccessDownloadFile } = useBulkDownloadToasts();

  // Fetch datasets for the selected uuids
  const datasetQuery = {
    query: getIDsQuery([...uuids]),
    _source: ['hubmap_id', 'processing', 'uuid', 'processing_type'],
    size: uuids.size,
  };
  const { searchHits, isLoading } = useSearchHits<BulkDownloadDataset>(datasetQuery);
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

  const protectedDatasetsFields = useProtectedDatasetsForm({
    selectedRows: new Set(uuids),
    deselectRows: removeUuidsOrRows,
    protectedDatasetsErrorMessage: (protectedDatasets) =>
      `You have selected ${protectedDatasets.length} protected datasets.`,
    trackEventHelper: (numProtectedDatasets) => {
      trackEvent({
        category: 'Bulk Download',
        action: 'Protected datasets selected',
        value: numProtectedDatasets,
      });
    },
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
        })
        .catch((e) => {
          toastErrorDownloadFile('Metadata', () => downloadMetadata(datasetsToDownload));
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
          setDownloadSuccess(true);
        })
        .catch((e) => {
          toastErrorDownloadFile('Manifest', () => downloadManifest(datasetsToDownload));
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
    isOpen,
    isLoading,
    errors,
    control,
    downloadOptions,
    onSubmit,
    handleSubmit,
    handleClose,
    openDialog,
    downloadManifest,
    downloadMetadata,
    ...protectedDatasetsFields,
  };
}

export { useBulkDownloadDialog };
