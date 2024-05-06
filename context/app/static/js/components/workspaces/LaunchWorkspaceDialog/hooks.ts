import { useCallback, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useLaunchWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { workspaceJobTypeIdField } from '../workspaceFormFields';
import { useLaunchWorkspace, useRunningWorkspace, useWorkspacesList } from '../hooks';
import { DEFAULT_JOB_TYPE } from '../constants';

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
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<LaunchWorkspaceFormTypes>({
    defaultValues: {
      workspaceJobTypeId: DEFAULT_JOB_TYPE,
    },
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  return {
    handleSubmit,
    setValue,
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
  const { isOpen, close, workspace } = useLaunchWorkspaceStore();
  const runningWorkspaceIsCurrentWorkpace = runningWorkspace?.id === workspace?.id;

  const { toastError } = useSnackbarActions();

  const { control, handleSubmit, isSubmitting, reset, setValue } = useLaunchWorkspaceForm();

  // The default value must be set as it will not update when passed to the form hook.
  useEffect(() => {
    if (workspace?.default_job_type) {
      setValue('workspaceJobTypeId', workspace.default_job_type);
    }
  }, [setValue, workspace]);

  // Track the running workspace name to prevent layout shift between stopping the running workspace and starting the new one.
  const runningWorkspaceName = useRef<string | undefined>('');
  if (isRunningWorkspace) {
    runningWorkspaceName.current = runningWorkspace?.name;
  } else {
    runningWorkspaceName.current = '';
  }

  const handleClose = useCallback(() => {
    runningWorkspaceName.current = '';
    reset();
    close();
  }, [close, reset]);

  const submit = useCallback(
    async ({ workspaceJobTypeId }: LaunchWorkspaceFormTypes) => {
      if (!workspace) {
        console.error('No workspace to run found.');
        return;
      }

      if (
        runningWorkspace &&
        (!runningWorkspaceIsCurrentWorkpace || workspace?.default_job_type !== workspaceJobTypeId)
      ) {
        try {
          await handleStopWorkspace(runningWorkspace.id);
        } catch (e) {
          toastError('Failed to stop workspace. Please try again.');
          console.error(e);
          return;
        }
      }

      await startAndOpenWorkspace({ jobTypeId: workspaceJobTypeId, workspace });
    },
    [
      workspace,
      runningWorkspace,
      startAndOpenWorkspace,
      runningWorkspaceIsCurrentWorkpace,
      handleStopWorkspace,
      toastError,
    ],
  );

  return {
    isRunningWorkspace,
    runningWorkspaceName: runningWorkspaceName.current,
    runningWorkspaceIsCurrentWorkpace,
    runningWorkspace,
    control,
    isOpen,
    reset,
    close,
    workspace,
    submit,
    handleSubmit,
    isSubmitting,
    handleClose,
  };
}

export { useLaunchWorkspaceDialog };
