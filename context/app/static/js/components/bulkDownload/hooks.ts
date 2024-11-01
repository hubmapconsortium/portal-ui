import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { bulkDownloadOptionsField } from 'js/components/bulkDownload/bulkDownloadFormFields';
import { BulkDownloadDataset, useBulkDownloadStore } from 'js/stores/useBulkDownloadStore';
import { createDownloadUrl } from 'js/helpers/functions';
import { useSnackbarActions } from 'js/shared-styles/snackbars/store';
import postAndDownloadFile from 'js/helpers/postAndDownloadFile';

export interface BulkDownloadFormTypes {
  bulkDownloadOptions: string;
  bulkDownloadMetadata: boolean;
}

const schema = z
  .object({
    bulkDownloadOptions: bulkDownloadOptionsField.bulkDownloadOptions,
    bulkDownloadMetadata: z.boolean().optional(),
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
  } = useForm<BulkDownloadFormTypes>({
    defaultValues: {
      bulkDownloadOptions: 'all',
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
  };
}

function useBulkDownloadDialog() {
  const { isOpen, datasets, open, close, setDatasets } = useBulkDownloadStore();
  const { control, handleSubmit, reset } = useBulkDownloadForm();
  const { toastError } = useSnackbarActions();

  const handleClose = useCallback(() => {
    reset();
    close();
  }, [close, reset]);

  const downloadMetadata = useCallback(
    (datasetsToDownload: BulkDownloadDataset[]) => {
      postAndDownloadFile({
        url: '/metadata/v0/datasets.tsv',
        body: { uuids: datasetsToDownload.map((dataset) => dataset.uuid) },
      }).catch((e) => {
        toastError('Error downloading metadata.');
        console.error(e);
      });
    },
    [toastError],
  );

  const downloadManifest = useCallback((datasetsToDownload: BulkDownloadDataset[]) => {
    const url = createDownloadUrl(
      `${datasetsToDownload.map((dataset) => dataset.hubmap_id).join('\t / \n')}\t / `,
      'text/plain',
    );

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'manifest.txt';
    downloadLink.click();

    URL.revokeObjectURL(url);
  }, []);

  const submit = useCallback(
    ({ bulkDownloadOptions, bulkDownloadMetadata }: BulkDownloadFormTypes) => {
      const datasetsToDownload = datasets.filter((dataset) => {
        if (bulkDownloadOptions === 'all') {
          return true;
        }
        return bulkDownloadOptions === 'raw' ? dataset.processing === 'raw' : dataset.processing === 'processed';
      });

      if (datasetsToDownload.length === 0) {
        toastError('No datasets were included in your download selection.');
        return;
      }

      if (bulkDownloadMetadata) {
        downloadMetadata(datasetsToDownload);
      }

      downloadManifest(datasetsToDownload);
    },
    [datasets, downloadManifest, downloadMetadata, toastError],
  );

  const openDialog = useCallback(
    (initialDatasets: BulkDownloadDataset[]) => {
      setDatasets(initialDatasets);
      open();
    },
    [setDatasets, open],
  );

  const onSubmit = useCallback(
    ({ bulkDownloadOptions, bulkDownloadMetadata }: BulkDownloadFormTypes) => {
      try {
        submit({ bulkDownloadOptions, bulkDownloadMetadata });
      } catch (e) {
        toastError('Error creating bulk download manifest.');
        console.error(e);
      }

      handleClose();
    },
    [submit, handleClose, toastError],
  );

  return {
    control,
    isOpen,
    datasets,
    reset,
    close,
    submit,
    onSubmit,
    handleSubmit,
    handleClose,
    openDialog,
  };
}

export { useBulkDownloadDialog };
