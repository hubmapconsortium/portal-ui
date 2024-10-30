import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { bulkDownloadOptionsField } from 'js/components/bulkDownload/bulkDownloadFormFields';
import { useBulkDownloadStore } from 'js/stores/useBulkDownloadStore';

export interface BulkDownloadFormTypes {
  bulkDownloadOptions: string;
}

const schema = z
  .object({
    ...bulkDownloadOptionsField,
  })
  .partial()
  .required({ bulkDownloadOptions: true });

function useLaunchWorkspaceForm() {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<BulkDownloadFormTypes>({
    defaultValues: {
      bulkDownloadOptions: '',
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
    isSubmitting: isSubmitting || isSubmitSuccessful,
  };
}

function useBulkDownloadDialog() {
  const { isOpen, datasets, open, close } = useBulkDownloadStore();

  const { control, handleSubmit, isSubmitting, reset } = useLaunchWorkspaceForm();

  const handleClose = useCallback(() => {
    reset();
    close();
  }, [close, reset]);

  const submit = useCallback(
    ({ bulkDownloadOptions }: BulkDownloadFormTypes) => {
      if (datasets.length === 0) {
        console.error('No workspace to run found.');
        return;
      }

      // eslint-disable-next-line no-console
      console.log('Creating bulk download manifest for these datasets:', bulkDownloadOptions);
    },
    [datasets.length],
  );

  return {
    control,
    isOpen,
    reset,
    close,
    submit,
    handleSubmit,
    isSubmitting,
    handleClose,
    openDialog: open,
  };
}

export { useBulkDownloadDialog };
