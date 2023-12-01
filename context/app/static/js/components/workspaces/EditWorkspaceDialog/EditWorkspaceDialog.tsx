import React, { useCallback, PropsWithChildren, BaseSyntheticEvent } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';

import DialogModal from 'js/shared-styles/DialogModal';
import { UseFormReturn, FormState, FieldValues } from 'react-hook-form';

const formId = 'edit-workspace-form';

type FormProps<T extends FieldValues> = Pick<UseFormReturn<T>, 'reset' | 'handleSubmit'> & Pick<FormState<T>, 'errors'>;

interface EditWorkspaceDialogTypes<T extends FieldValues> extends PropsWithChildren {
  title: string;
  isOpen: boolean;
  close: () => void;
  isSubmitting: boolean;
  onSubmit: (fieldValues: T) => Promise<void>;
}

function EditWorkspaceDialog<T extends FieldValues>({
  title,
  isOpen,
  close,
  reset,
  children,
  onSubmit,
  handleSubmit,
  errors,
  isSubmitting,
}: EditWorkspaceDialogTypes<T> & FormProps<T>) {
  const submit = useCallback(
    async (e: BaseSyntheticEvent) => {
      try {
        if (isSubmitting) return;
        await handleSubmit(onSubmit)(e);
      } finally {
        reset();
        close();
      }
    },
    [onSubmit, reset, close, isSubmitting, handleSubmit],
  );

  return (
    <DialogModal
      title={title}
      maxWidth="lg"
      content={
        <Box
          id={formId}
          component="form"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={submit}
        >
          {children}
        </Box>
      }
      isOpen={isOpen}
      handleClose={close}
      actions={
        <Stack direction="row" spacing={2} alignItems="end">
          <Button type="button" onClick={close} disabled={isSubmitting}>
            Cancel
          </Button>
          <LoadingButton loading={isSubmitting} type="submit" form={formId} disabled={Object.keys(errors).length > 0}>
            Save
          </LoadingButton>
        </Stack>
      }
      withCloseButton
    />
  );
}

export default EditWorkspaceDialog;
