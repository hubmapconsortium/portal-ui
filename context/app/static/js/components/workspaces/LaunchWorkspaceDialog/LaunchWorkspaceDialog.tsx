import React, { useCallback } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import DialogModal from 'js/shared-styles/DialogModal';
import { Alert } from 'js/shared-styles/alerts';
import WorkspaceJobTypeField from '../WorkspaceJobTypeField';
import { useLaunchWorkspaceDialog } from './hooks';

const formId = 'launch-workspace-form';

function LaunchWorkspaceDialog() {
  const {
    isRunningWorkspace,
    runningWorkspace,
    control,
    handleSubmit,
    submit,
    isOpen,
    reset,
    close,
    workspace,
    isSubmitting,
  } = useLaunchWorkspaceDialog();

  const workspaceName = workspace?.name;
  const runningWorkspaceName = runningWorkspace?.name;

  const handleClose = useCallback(() => {
    reset();
    close();
  }, [close, reset]);

  return (
    <DialogModal
      title={`Launch ${workspaceName}`}
      maxWidth="md"
      content={
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <form id={formId} onSubmit={handleSubmit(submit)}>
          <Stack direction="column" gap={4}>
            {isRunningWorkspace && (
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
