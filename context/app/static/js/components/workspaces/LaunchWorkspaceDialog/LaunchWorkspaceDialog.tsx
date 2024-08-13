import React, { useCallback } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useSnackbarActions } from 'js/shared-styles/snackbars';
import DialogModal from 'js/shared-styles/DialogModal';
import { Alert } from 'js/shared-styles/alerts';
import WorkspaceJobTypeField from '../WorkspaceJobTypeField';
import { useLaunchWorkspaceDialog, LaunchWorkspaceFormTypes } from './hooks';

const formId = 'launch-workspace-form';

function LaunchWorkspaceDialog() {
  const {
    runningWorkspaceName,
    runningWorkspaceIsCurrentWorkpace,
    control,
    handleSubmit,
    submit,
    isOpen,
    handleClose,
    workspace,
    isSubmitting,
  } = useLaunchWorkspaceDialog();

  const workspaceName = workspace?.name;
  const { toastError } = useSnackbarActions();

  const onSubmit = useCallback(
    ({ workspaceJobTypeId }: LaunchWorkspaceFormTypes) => {
      submit({ workspaceJobTypeId })
        .then(() => {
          handleClose();
        })
        .catch((e) => {
          toastError('Failed to launch workspace. Please try again.');
          console.error(e);
        });
    },
    [submit, handleClose, toastError],
  );

  return (
    <DialogModal
      title={`Launch ${workspaceName}`}
      maxWidth="md"
      content={
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <form id={formId} onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column" gap={4}>
            {runningWorkspaceName && !runningWorkspaceIsCurrentWorkpace && (
              <Alert
                severity="warning"
                sx={{
                  '.MuiAlert-message': {
                    flexGrow: 1,
                  },
                  alignItems: 'center',
                }}
              >
                {runningWorkspaceName} is currently running. You can only run one workspace at a time. To launch this
                workspace, jobs in the workspace {runningWorkspaceName} will be stopped. Make sure to save all progress
                before launching this workspace.
              </Alert>
            )}
            <Typography>
              All workspaces are launched with Python support, with the option to add support for R . Workspaces with
              added R support may experience longer load times.
            </Typography>
            <Typography>
              If a workspace was previously launched with R, launching a workspace without R support may cause issues
              with your saved work.
            </Typography>
            <WorkspaceJobTypeField control={control} name="workspaceJobTypeId" />
          </Stack>
        </form>
      }
      isOpen={isOpen}
      handleClose={handleClose}
      actions={
        <Stack direction="row" spacing={2} alignItems="end">
          <Button type="button" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <LoadingButton type="submit" form={formId} loading={isSubmitting}>
            Launch
          </LoadingButton>
        </Stack>
      }
      withCloseButton
    />
  );
}

export default LaunchWorkspaceDialog;
