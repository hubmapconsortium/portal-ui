import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEventCallback } from '@mui/material/utils';
import { z } from 'zod';

import { useLaunchWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { workspaceJobTypeIdField, workspaceResourceOptionsField } from 'js/components/workspaces/workspaceFormFields';
import { useLaunchWorkspace, useRunningWorkspace } from 'js/components/workspaces/hooks';
import {
  DEFAULT_GPU_ENABLED,
  DEFAULT_JOB_TYPE,
  DEFAULT_MEMORY_MB,
  DEFAULT_NUM_CPUS,
  DEFAULT_TIME_LIMIT_MINUTES,
  MAX_NUM_CONCURRENT_WORKSPACES,
} from 'js/components/workspaces/constants';
import { MergedWorkspace, WorkspaceResourceOptions } from 'js/components/workspaces/types';
import { findBestJobType, getWorkspaceResourceOptions, isRunningWorkspace } from 'js/components/workspaces/utils';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';

export interface LaunchWorkspaceFormTypes {
  workspaceJobTypeId: string;
  workspaceResourceOptions: WorkspaceResourceOptions;
}

const schema = z
  .object({
    ...workspaceJobTypeIdField,
    ...workspaceResourceOptionsField,
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
      workspaceResourceOptions: {
        num_cpus: DEFAULT_NUM_CPUS,
        memory_mb: DEFAULT_MEMORY_MB,
        time_limit_minutes: DEFAULT_TIME_LIMIT_MINUTES,
        gpu_enabled: DEFAULT_GPU_ENABLED,
      },
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
  const runningWorkspaces = useRunningWorkspace();
  const maxNumOfRunningWorkspacesReached = runningWorkspaces?.length >= MAX_NUM_CONCURRENT_WORKSPACES;

  const { startAndOpenWorkspace } = useLaunchWorkspace();
  const { isOpen, open, close, workspace, setWorkspace, dialogType, setDialogType } = useLaunchWorkspaceStore();

  const currentWorkspaceIsRunning = runningWorkspaces?.some((ws) => ws.id === workspace?.id);

  const { toastErrorLaunchWorkspace } = useWorkspaceToasts();

  const { control, handleSubmit, isSubmitting, reset, setValue } = useLaunchWorkspaceForm();

  // The default value must be set as it will not update when passed to the form hook.
  useEffect(() => {
    if (workspace?.default_job_type) {
      setValue('workspaceJobTypeId', workspace.default_job_type);
    }
  }, [setValue, workspace]);

  const handleClose = useCallback(() => {
    reset();
    close();
    setDialogType(null);
  }, [close, reset, setDialogType]);

  const submit = useEventCallback(
    async ({ workspaceJobTypeId, workspaceResourceOptions }: LaunchWorkspaceFormTypes) => {
      if (!workspace) {
        console.error('No workspace to run found.');
        return;
      }

      await startAndOpenWorkspace({
        jobTypeId: workspaceJobTypeId,
        workspace,
        resourceOptions: workspaceResourceOptions,
      });
    },
  );

  const launchOrOpenDialog = useEventCallback((newWorkspace: MergedWorkspace) => {
    setWorkspace(newWorkspace);
    const workspaceJobTypeId = findBestJobType(newWorkspace.jobs);
    const workspaceResourceOptions = getWorkspaceResourceOptions(newWorkspace);

    if (isRunningWorkspace(newWorkspace)) {
      submit({ workspaceJobTypeId, workspaceResourceOptions }).catch((e) => {
        toastErrorLaunchWorkspace();
        console.error(e);
      });
    } else {
      open();
    }
  });

  return {
    maxNumOfRunningWorkspacesReached,
    currentWorkspaceIsRunning,
    runningWorkspaces,
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
    dialogType,
    setDialogType,
  };
}

export { useLaunchWorkspaceDialog };
