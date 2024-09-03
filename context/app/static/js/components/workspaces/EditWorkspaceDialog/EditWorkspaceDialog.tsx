import React, { useCallback, PropsWithChildren } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { UseFormReturn, FormState, FieldValues } from 'react-hook-form';

import DialogModal from 'js/shared-styles/DialogModal';
import { useEditWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import EditWorkspaceTemplatesDialog from '../EditWorkspaceTemplatesDialog';
import EditWorkspaceNameDialog from '../EditWorkspaceNameDialog';
import AddDatasetsDialog from '../AddDatasetsDialog';
import { WorkspaceUpdateErrorToast, WorkspaceUpdateSuccessToast } from '../WorkspaceToasts';

const formId = 'edit-workspace-form';

type FormProps<T extends FieldValues> = Pick<UseFormReturn<T>, 'reset' | 'handleSubmit'> & Pick<FormState<T>, 'errors'>;

interface EditWorkspaceDialogTypes<T extends FieldValues> extends PropsWithChildren {
  title: string;
  isSubmitting: boolean;
  onSubmit: (fieldValues: T) => Promise<void>;
  resetState?: () => void;
  disabled?: boolean;
}

function EditWorkspaceDialogContent<T extends FieldValues>({
  title,
  reset,
  resetState,
  children,
  onSubmit,
  handleSubmit,
  errors,
  isSubmitting,
  disabled,
}: EditWorkspaceDialogTypes<T> & FormProps<T>) {
  const { isOpen, close } = useEditWorkspaceStore();
  const { toastSuccess, toastError } = useSnackbarActions();

  const handleClose = useCallback(() => {
    reset();
    if (resetState) {
      resetState();
    }
    close();
  }, [close, resetState, reset]);

  const submit = useCallback(
    (fieldValues: T) => {
      onSubmit(fieldValues)
        .then(() => {
          toastSuccess(WorkspaceUpdateSuccessToast());
          handleClose();
        })
        .catch((error) => {
          console.error(error);
          toastError(WorkspaceUpdateErrorToast());
        });
    },
    [onSubmit, handleClose, toastError, toastSuccess],
  );

  return (
    <DialogModal
      title={title}
      maxWidth="lg"
      content={
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <form id={formId} onSubmit={handleSubmit(submit)}>
          {children}
        </form>
      }
      isOpen={isOpen}
      handleClose={handleClose}
      actions={
        <Stack direction="row" spacing={2} alignItems="end">
          <Button type="button" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <LoadingButton
            loading={isSubmitting}
            type="submit"
            form={formId}
            disabled={disabled ?? Object.keys(errors).length > 0}
          >
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

  if (dialogType === 'ADD_DATASETS') {
    return <AddDatasetsDialog workspace={workspace} />;
  }

  return null;
}

export { EditWorkspaceDialogContent };
export default EditWorkspaceDialog;
