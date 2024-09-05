import { useCallback, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useLaunchWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { workspaceJobTypeIdField } from '../workspaceFormFields';
import { useLaunchWorkspace, useRunningWorkspace, useWorkspacesList } from '../hooks';
import { DEFAULT_JOB_TYPE } from '../constants';
import { MergedWorkspace } from '../types';
import { findBestJobType, isRunningWorkspace } from '../utils';

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
  const runningWorkspaceExists = Boolean(runningWorkspace);

  const { handleStopWorkspace } = useWorkspacesList();
  const { startAndOpenWorkspace } = useLaunchWorkspace();
  const { isOpen, open, close, workspace, setWorkspace } = useLaunchWorkspaceStore();

  const runningWorkspaceIsCurrentWorkpace = runningWorkspace?.id === workspace?.id;

  const { toastErrorStopWorkspace, toastErrorLaunchWorkspace } = useSnackbarActions();

  const { control, handleSubmit, isSubmitting, reset, setValue } = useLaunchWorkspaceForm();

  // The default value must be set as it will not update when passed to the form hook.
  useEffect(() => {
    if (workspace?.default_job_type) {
      setValue('workspaceJobTypeId', workspace.default_job_type);
    }
  }, [setValue, workspace]);

  // Track the running workspace name to prevent layout shift between stopping the running workspace and starting the new one.
  const runningWorkspaceName = useRef<string | undefined>('');
  if (runningWorkspaceExists) {
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
          toastErrorStopWorkspace();
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
      toastErrorStopWorkspace,
    ],
  );

  const launchOrOpenDialog = useCallback(
    (newWorkspace: MergedWorkspace) => {
      setWorkspace(newWorkspace);
      const workspaceJobTypeId = findBestJobType(newWorkspace.jobs);

      if (isRunningWorkspace(newWorkspace)) {
        submit({ workspaceJobTypeId }).catch((e) => {
          toastErrorLaunchWorkspace();
          console.error(e);
        });
      } else {
        open();
      }
    },
    [submit, toastErrorLaunchWorkspace, setWorkspace, open],
  );

  return {
    runningWorkspaceExists,
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
    launchOrOpenDialog,
  };
}

export { useLaunchWorkspaceDialog };
