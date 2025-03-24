import React, { useCallback } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import DialogModal from 'js/shared-styles/dialogs/DialogModal';
import { Alert } from 'js/shared-styles/alerts';
import WorkspaceJobTypeField from 'js/components/workspaces/WorkspaceJobTypeField';
import AdvancedConfigOptions from 'js/components/workspaces/AdvancedConfigOptions';
import { StyledSubtitle1 } from 'js/components/workspaces/style';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import {
  useLaunchWorkspaceDialog,
  LaunchWorkspaceFormTypes,
} from 'js/components/workspaces/LaunchWorkspaceDialog/hooks';
import WorkspaceEnvironmentDescription from '../WorkspaceEnvironmentDescription';

const formId = 'launch-workspace-form';

const text = {
  environment: {
    title: 'Environment Selection',
    description: (
      <WorkspaceEnvironmentDescription>
        <Typography>
          If a workspace was previously launched with R, launching a workspace without R support may cause issues with
          your saved work.
        </Typography>
      </WorkspaceEnvironmentDescription>
    ),
  },
  resources: {
    alert:
      'Advanced configuration settings are not retained from previous sessions. If you customized settings in a previous launch, you will need to reapply those changes.',
    description:
      'Adjusting these settings may result in longer workspace load times and could potentially affect your saved work.',
  },
};

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
    dialogType,
  } = useLaunchWorkspaceDialog();

  const workspaceName = workspace?.name;
  const { toastErrorLaunchWorkspace } = useWorkspaceToasts();

  const newWorkspaceLaunch = dialogType === 'LAUNCH_NEW_WORKSPACE';
  const isAnotherWorkspaceRunning = runningWorkspaceName && !runningWorkspaceIsCurrentWorkpace;

  const runningWorkspaceAlert = isAnotherWorkspaceRunning && (
    <Alert
      severity="warning"
      sx={{
        '.MuiAlert-message': {
          flexGrow: 1,
        },
        alignItems: 'center',
      }}
    >
      {runningWorkspaceName} is currently running. You can only run one workspace at a time. To launch this workspace,
      jobs in the workspace {runningWorkspaceName} will be stopped. Make sure to save all progress before launching this
      workspace.
    </Alert>
  );

  const onSubmit = useCallback(
    ({ workspaceJobTypeId, workspaceResourceOptions }: LaunchWorkspaceFormTypes) => {
      submit({ workspaceJobTypeId, workspaceResourceOptions })
        .then(() => {
          handleClose();
        })
        .catch((e) => {
          toastErrorLaunchWorkspace();
          console.error(e);
        });
    },
    [submit, handleClose, toastErrorLaunchWorkspace],
  );

  return (
    <DialogModal
      title={`Launch ${workspaceName}`}
      maxWidth="md"
      content={
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <form id={formId} onSubmit={handleSubmit(onSubmit)}>
          {newWorkspaceLaunch ? (
            runningWorkspaceAlert
          ) : (
            <Stack direction="column" spacing={1}>
              {runningWorkspaceAlert}
              <Alert severity="info">{text.resources.alert}</Alert>
              <SummaryPaper>
                <Stack direction="column" spacing={2}>
                  <StyledSubtitle1>{text.environment.title}</StyledSubtitle1>
                  {text.environment.description}
                  <WorkspaceJobTypeField control={control} name="workspaceJobTypeId" />
                </Stack>
              </SummaryPaper>
              <AdvancedConfigOptions control={control} description={text.resources.description} />
            </Stack>
          )}
        </form>
      }
      isOpen={isOpen}
      handleClose={handleClose}
      actions={
        <Stack direction="row" spacing={2} alignItems="end">
          <Button type="button" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" form={formId} loading={isSubmitting}>
            Launch Workspace
          </LoadingButton>
        </Stack>
      }
      withCloseButton
    />
  );
}

export default LaunchWorkspaceDialog;
