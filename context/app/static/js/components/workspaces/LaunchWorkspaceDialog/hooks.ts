import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useLaunchWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { workspaceJobTypeIdField } from '../workspaceFormFields';
import { useLaunchWorkspace, useRunningWorkspace, useWorkspacesList } from '../hooks';
import { MergedWorkspace, Workspace } from '../types';

export interface LaunchWorkspaceFormTypes {
  workspaceJobTypeId: string;
}

const schema = z
  .object({
    ...workspaceJobTypeIdField,
  })
  .partial()
  .required({ workspaceJobTypeId: true });

function useLaunchWorkspaceForm() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<LaunchWorkspaceFormTypes>({
    defaultValues: {
      workspaceJobTypeId: 'jupyter_lab',
    },
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  return {
    handleSubmit,
    control,
    errors,
    reset,
    isSubmitting: isSubmitting || isSubmitSuccessful,
  };
}

function useLaunchWorkspaceDialog() {
  const runningWorkspace = useRunningWorkspace();
  const isRunningWorkspace = Boolean(runningWorkspace);

  const { handleStopWorkspace } = useWorkspacesList();
  const { startAndOpenWorkspace } = useLaunchWorkspace();
  const { isOpen, close, reset, workspace } = useLaunchWorkspaceStore();

  const { toastError } = useSnackbarActions();

  const { control, handleSubmit } = useLaunchWorkspaceForm();

  const handleLaunch = useCallback(
    ({ jobTypeId, ws }: { jobTypeId: string; ws: Workspace }) => {
      startAndOpenWorkspace({ workspace: ws, jobTypeId })
        .catch((e) => {
          toastError('Failed to launch workspace. Please try again.');
          reset();
          console.error(e);
        })
        .finally(() => {
          close();
          // reset the dialog even if the launch fails
          // since the running workspace has stopped
          reset();
        });
    },
    [close, reset, startAndOpenWorkspace, toastError],
  );

  const handleStopAndLaunch = useCallback(
    ({ jobTypeId, ws, runningWs }: { jobTypeId: string; ws: Workspace; runningWs: MergedWorkspace }) => {
      handleStopWorkspace(runningWs.id)
        .then(() => {
          // Close to avoid flash of blank launch dialog
          close();
          startAndOpenWorkspace({ workspace: ws, jobTypeId })
            .catch((e) => {
              toastError('Failed to launch workspace. Please try again.');
              reset();
              console.error(e);
            })
            .finally(() => {
              // reset the dialog even if the launch fails
              // since the running workspace has stopped
              reset();
            });
        })
        .catch((e) => {
          toastError('Failed to stop workspace. Please try again.');
          console.error(e);
        });
    },
    [close, reset, startAndOpenWorkspace, toastError, handleStopWorkspace],
  );

  const submit = useCallback(
    ({ workspaceJobTypeId }: LaunchWorkspaceFormTypes) => {
      if (!workspace) {
        console.error('No workspace to run found');
        return;
      }

      if (runningWorkspace) {
        handleStopAndLaunch({ jobTypeId: workspaceJobTypeId, ws: workspace, runningWs: runningWorkspace });
      }

      handleLaunch({ jobTypeId: workspaceJobTypeId, ws: workspace });
    },
    [workspace, runningWorkspace, handleLaunch, handleStopAndLaunch],
  );

  return { isRunningWorkspace, runningWorkspace, control, isOpen, close, workspace, submit, handleSubmit };
}

export { useLaunchWorkspaceDialog };
