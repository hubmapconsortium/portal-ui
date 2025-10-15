import React, { useCallback, PropsWithChildren } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { UseFormReturn, FormState, FieldValues } from 'react-hook-form';

import DialogModal from 'js/shared-styles/dialogs/DialogModal';
import { DialogType, useEditWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import EditWorkspaceTemplatesDialog from 'js/components/workspaces/EditWorkspaceTemplatesDialog';
import EditWorkspaceNameDialog from 'js/components/workspaces/EditWorkspaceNameDialog';
import AddDatasetsDialog from 'js/components/workspaces/AddDatasetsDialog';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import { WorkspacesEventContextProvider } from 'js/components/workspaces/contexts';
import { Workspace, WorkspacesEventCategories } from 'js/components/workspaces/types';

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
  const { toastSuccessUpdateWorkspace, toastErrorUpdateWorkspace } = useWorkspaceToasts();

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
          toastSuccessUpdateWorkspace();
          handleClose();
        })
        .catch((error) => {
          console.error(error);
          toastErrorUpdateWorkspace();
        });
    },
    [onSubmit, handleClose, toastSuccessUpdateWorkspace, toastErrorUpdateWorkspace],
  );

  return (
    <DialogModal
      title={title}
      maxWidth="lg"
      content={
        <form id={formId} onSubmit={(e) => void handleSubmit(submit)(e)}>
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

function EditWorkspaceDialogOptions({
  workspace,
  dialogType,
}: {
  workspace: Workspace | null;
  dialogType: DialogType;
}) {
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

function EditWorkspaceDialog() {
  const { workspace, dialogType } = useEditWorkspaceStore();

  return (
    <WorkspacesEventContextProvider
      currentEventCategory={WorkspacesEventCategories.WorkspaceDialog}
      currentWorkspaceItemId={workspace?.id}
      currentWorkspaceItemName={workspace?.name}
    >
      <EditWorkspaceDialogOptions workspace={workspace} dialogType={dialogType} />
    </WorkspacesEventContextProvider>
  );
}

export { EditWorkspaceDialogContent };
export default EditWorkspaceDialog;
