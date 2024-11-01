import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { bulkDownloadOptionsField } from 'js/components/bulkDownload/bulkDownloadFormFields';
import { useBulkDownloadStore } from 'js/stores/useBulkDownloadStore';
import { Dataset } from 'js/components/types';

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

  const handleClose = useCallback(() => {
    reset();
    close();
  }, [close, reset]);

  const submit = useCallback(
    ({ bulkDownloadOptions, bulkDownloadMetadata }: BulkDownloadFormTypes) => {
      if (datasets.length === 0) {
        console.error('No datasets to download found.');
        reset();
        return;
      }

      // eslint-disable-next-line no-console
      console.log(
        'Creating bulk download manifest with these options:',
        bulkDownloadOptions,
        bulkDownloadMetadata,
        'for these datasets:',
        datasets,
      );
      reset();
    },
    [datasets, reset],
  );

  const openDialog = useCallback(
    (initialDatasets: Pick<Dataset, 'hubmap_id'>[]) => {
      setDatasets(initialDatasets);
      open();
    },
    [setDatasets, open],
  );

  return {
    control,
    isOpen,
    datasets,
    reset,
    close,
    submit,
    handleSubmit,
    handleClose,
    openDialog,
  };
}

export { useBulkDownloadDialog };
