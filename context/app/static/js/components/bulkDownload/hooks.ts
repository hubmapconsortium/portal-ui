import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { bulkDownloadOptionsField, bulkDownloadMetadataField } from 'js/components/bulkDownload/bulkDownloadFormFields';
import { BulkDownloadDataset, useBulkDownloadStore } from 'js/stores/useBulkDownloadStore';
import { createDownloadUrl } from 'js/helpers/functions';
import { useSnackbarActions } from 'js/shared-styles/snackbars/store';
import postAndDownloadFile, { downloadFile } from 'js/helpers/postAndDownloadFile';
import { getIDsQuery } from 'js/helpers/queries';
import { useSearchHits } from 'js/hooks/useSearchData';
import { useProtectedDatasetsForm } from 'js/hooks/useProtectedDatasets';
import { trackEvent } from 'js/helpers/trackers';

export const allBulkDownloadOptions: {
  key: string;
  label: string;
  isIncluded: (dataset: BulkDownloadDataset) => boolean;
}[] = [
  {
    key: 'raw',
    label: 'raw',
    isIncluded: (dataset: BulkDownloadDataset) => dataset.processing === 'raw',
  },
  {
    key: 'central',
    label: 'HuBMAP centrally processed',
    isIncluded: (dataset: BulkDownloadDataset) => dataset.processing_type === 'hubmap',
  },
  {
    key: 'external',
    label: 'lab or externally processed',
    isIncluded: (dataset: BulkDownloadDataset) =>
      dataset.processing === 'processed' && dataset.processing_type !== 'hubmap',
  },
];

export interface BulkDownloadFormTypes {
  bulkDownloadOptions: string[];
  bulkDownloadMetadata: boolean;
}

const schema = z
  .object({
    ...bulkDownloadOptionsField,
    ...bulkDownloadMetadataField,
  })
  .partial()
  .required({ bulkDownloadOptions: true });

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

function useBulkDownloadDialog() {
  const { isOpen, uuids, open, close, setUuids } = useBulkDownloadStore();
  const { control, handleSubmit, errors, reset, trigger } = useBulkDownloadForm();
  const { toastError, toastSuccess } = useSnackbarActions();

  const datasetQuery = {
    query: getIDsQuery([...uuids]),
    _source: ['hubmap_id', 'processing', 'uuid', 'files', 'processing_type'],
    size: 1000,
  };

  const { searchHits, isLoading } = useSearchHits<BulkDownloadDataset>(datasetQuery);
  const datasets = searchHits.map(({ _source }) => _source);

  const downloadOptions = allBulkDownloadOptions
    .map((option) => ({ ...option, count: datasets.filter((dataset) => option.isIncluded(dataset)).length }))
    .filter((option) => option.count > 0);

  const handleClose = useCallback(() => {
    reset();
    close();
  }, [close, reset]);

  const downloadMetadata = useCallback(
    (datasetsToDownload: BulkDownloadDataset[]) => {
      postAndDownloadFile({
        url: '/metadata/v0/datasets.tsv',
        body: { uuids: datasetsToDownload.map((dataset) => dataset.uuid) },
        fileName: 'metadata.tsv',
      })
        .then(() => {
          toastSuccess('Metadata file successfully downloaded.');
        })
        .catch((e) => {
          toastError('Metadata file failed to download.');
          console.error(e);
        });
    },
    [toastError, toastSuccess],
  );

  const downloadManifest = useCallback(
    (datasetsToDownload: BulkDownloadDataset[]) => {
      try {
        const url = createDownloadUrl(
          `${datasetsToDownload.map((dataset) => dataset.hubmap_id).join('\t / \n')}\t / `,
          'text/plain',
        );

        downloadFile({ url, fileName: 'manifest.txt' });
        toastSuccess('Manifest file successfully downloaded.');
      } catch (e) {
        toastError('Manifest file failed to download.');
        console.error(e);
      }
    },
    [toastError, toastSuccess],
  );

  const openDialog = useCallback(
    (initialUuids: Set<string>) => {
      setUuids(initialUuids);
      open();
    },
    [setUuids, open],
  );

  const onSubmit = useCallback(
    ({ bulkDownloadOptions, bulkDownloadMetadata }: BulkDownloadFormTypes) => {
      const datasetsToDownload = datasets.filter((dataset) =>
        bulkDownloadOptions.some((option) =>
          allBulkDownloadOptions.find(({ key }) => key === option)?.isIncluded(dataset),
        ),
      );

      if (bulkDownloadMetadata) {
        downloadMetadata(datasetsToDownload);
      }

      downloadManifest(datasetsToDownload);
      handleClose();
    },
    [handleClose, datasets, downloadMetadata, downloadManifest],
  );

  // Trigger error on initial load for required fields, because no default options are given
  useEffect(() => {
    if (isOpen) {
      trigger('bulkDownloadOptions').catch((e) => {
        console.error(e);
      });
    }
  }, [isOpen, trigger]);

  const { protectedRows, ...rest } = useProtectedDatasetsForm({
    selectedRows: new Set(uuids),
    deselectRows: (datasetUuids: string[]) => setUuids(new Set(datasetUuids)),
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

  const removeAndUnselectProtectedDatasets = useCallback(() => {
    setUuids(new Set([...uuids].filter((uuid) => !protectedRows.find((row) => row._source?.uuid === uuid))));
  }, [uuids, protectedRows, setUuids]);

  return {
    control,
    isOpen,
    datasets,
    downloadOptions,
    errors,
    isLoading,
    reset,
    close,
    onSubmit,
    handleSubmit,
    handleClose,
    openDialog,
    protectedRows,
    removeAndUnselectProtectedDatasets,
    ...rest,
  };
}

export { useBulkDownloadDialog };
