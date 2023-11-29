import React, { useCallback, useEffect } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';

import DialogModal from 'js/shared-styles/DialogModal';
import { useEditWorkspaceNameStore } from 'js/stores/useWorkspaceModalStore';
import Step from 'js/shared-styles/surfaces/Step';
import { useEditWorkspaceForm, EditWorkspaceFormTypes } from './hooks';
import WorkspaceField from '../WorkspaceField/WorkspaceField';

function Dialog({
  workspaceName,
  workspaceId,
  isOpen,
  close,
}: {
  workspaceName: string;
  workspaceId: number;
  isOpen: boolean;
  close: () => void;
}) {
  const { onSubmit, control, handleSubmit, isSubmitting, errors, reset } = useEditWorkspaceForm({
    defaultName: workspaceName,
    workspaceId,
  });

  const submit = useCallback(
    async ({ 'workspace-name': wsName }: EditWorkspaceFormTypes) => {
      await onSubmit({
        workspaceName: wsName,
      });
    },
    [onSubmit],
  );

  useEffect(() => reset(), [isOpen, reset]);

  return (
    <DialogModal
      title="Edit Workspace Name"
      content={
        <Box
          id="edit-workspace-form"
          component="form"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit(submit)}
        >
          <Step title="Rename Workspace">
            <WorkspaceField
              control={control}
              name="workspace-name"
              label="Name"
              placeholder="Like “Spleen-Related Data” or “ATAC-seq Visualizations”"
              autoFocus
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                e.stopPropagation();
              }}
            />
          </Step>
        </Box>
      }
      isOpen={isOpen}
      handleClose={close}
      actions={
        <Stack direction="row" spacing={2} alignItems="end">
          <Button type="button" onClick={close}>
            Cancel
          </Button>
          <LoadingButton
            loading={isSubmitting}
            type="submit"
            form="edit-workspace-form"
            disabled={Object.keys(errors).length > 0}
          >
            Save
          </LoadingButton>
        </Stack>
      }
      withCloseButton
    />
  );
}

function EditWorkspaceNameDialog() {
  const { isOpen, close, workspace } = useEditWorkspaceNameStore();
  const workspaceName = workspace?.name;
  const workspaceId = workspace?.id;

  if (!(workspaceName && workspaceId)) {
    return null;
  }

  return <Dialog workspaceName={workspaceName} workspaceId={workspaceId} isOpen={isOpen} close={close} />;
}

export default EditWorkspaceNameDialog;
