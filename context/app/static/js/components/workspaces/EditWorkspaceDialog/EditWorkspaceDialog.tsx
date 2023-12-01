import React, { useCallback, PropsWithChildren, BaseSyntheticEvent } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { UseFormReturn, FormState, FieldValues } from 'react-hook-form';

import DialogModal from 'js/shared-styles/DialogModal';
import { useEditWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import EditWorkspaceTemplatesDialog from '../EditWorkspaceTemplatesDialog';
import EditWorkspaceNameDialog from '../EditWorkspaceNameDialog';

const formId = 'edit-workspace-form';

type FormProps<T extends FieldValues> = Pick<UseFormReturn<T>, 'reset' | 'handleSubmit'> & Pick<FormState<T>, 'errors'>;

interface EditWorkspaceDialogTypes<T extends FieldValues> extends PropsWithChildren {
  title: string;
  isSubmitting: boolean;
  onSubmit: (fieldValues: T) => Promise<void>;
}

function EditWorkspaceDialogContent<T extends FieldValues>({
  title,
  reset,
  children,
  onSubmit,
  handleSubmit,
  errors,
  isSubmitting,
}: EditWorkspaceDialogTypes<T> & FormProps<T>) {
  const { isOpen, close } = useEditWorkspaceStore();
  const { toastSuccess, toastError } = useSnackbarActions();

  const submit = useCallback(
    (e: BaseSyntheticEvent) => {
      if (isSubmitting) return;

      handleSubmit(onSubmit)(e)
        .then(() => {
          toastSuccess('Workspace successfully updated.');
          reset();
          close();
        })
        .catch(() => {
          toastError('Failed to update workspace.');
        });
    },
    [onSubmit, reset, close, isSubmitting, handleSubmit, toastError, toastSuccess],
  );

  return (
    <DialogModal
      title={title}
      maxWidth="lg"
      content={
        <form id={formId} onSubmit={submit}>
          {children}
        </form>
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

function EditWorkspaceDialog() {
  const { workspace, dialogType } = useEditWorkspaceStore();

  if (!workspace) {
    return null;
  }
  if (dialogType === 'UPDATE_NAME') {
    return <EditWorkspaceNameDialog workspace={workspace} />;
  }

  if (dialogType === 'UPDATE_TEMPLATES') {
    return <EditWorkspaceTemplatesDialog workspace={workspace} />;
  }

  return null;
}

export { EditWorkspaceDialogContent };
export default EditWorkspaceDialog;
