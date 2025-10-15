import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { useEventCallback } from '@mui/material/utils';

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
import { WorkspacesEventContextProvider } from 'js/components/workspaces/contexts';
import { WorkspacesEventCategories } from 'js/components/workspaces/types';
import { MAX_NUM_CONCURRENT_WORKSPACES } from 'js/components/workspaces/constants';
import { tooManyWorkspacesRunning } from 'js/components/workspaces/utils';
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
    currentWorkspaceIsRunning,
    runningWorkspaces,
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

  const tooManyWorkspacesAlert = tooManyWorkspacesRunning(runningWorkspaces) && !currentWorkspaceIsRunning && (
    <Alert
      severity="warning"
      sx={{
        '.MuiAlert-message': {
          flexGrow: 1,
        },
        alignItems: 'center',
      }}
    >
      You can only run {MAX_NUM_CONCURRENT_WORKSPACES} workspaces at a time. Please stop at least one of your active
      workspace jobs before launching this workspace.
    </Alert>
  );

  const onSubmit = useEventCallback(({ workspaceJobTypeId, workspaceResourceOptions }: LaunchWorkspaceFormTypes) => {
    if (!workspace) {
      toastErrorLaunchWorkspace();
      console.error('No workspace to run found.');
      return;
    }

    submit({ workspaceToLaunch: workspace, workspaceJobTypeId, workspaceResourceOptions })
      .then(() => {
        handleClose();
      })
      .catch((e) => {
        toastErrorLaunchWorkspace();
        console.error(e);
      });
  });

  return (
    <WorkspacesEventContextProvider
      currentEventCategory={WorkspacesEventCategories.WorkspaceDialog}
      currentWorkspaceItemId={workspace?.id}
      currentWorkspaceItemName={workspaceName}
    >
      <DialogModal
        title={`Launch ${workspaceName}`}
        maxWidth="md"
        content={
          <form id={formId} onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
            {newWorkspaceLaunch ? (
              tooManyWorkspacesAlert
            ) : (
              <Stack direction="column" spacing={1}>
                {tooManyWorkspacesAlert}
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
            <LoadingButton
              type="submit"
              variant="contained"
              disabled={tooManyWorkspacesRunning(runningWorkspaces)}
              form={formId}
              loading={isSubmitting}
            >
              Launch Workspace
            </LoadingButton>
          </Stack>
        }
        withCloseButton
      />
    </WorkspacesEventContextProvider>
  );
}

export default LaunchWorkspaceDialog;
