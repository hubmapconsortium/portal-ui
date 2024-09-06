import { useCallback, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useLaunchWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { workspaceJobTypeIdField, workspaceResourceOptionsField } from 'js/components/workspaces/workspaceFormFields';
import { useLaunchWorkspace, useRunningWorkspace, useWorkspacesList } from 'js/components/workspaces/hooks';
import {
  DEFAULT_GPU_ENABLED,
  DEFAULT_JOB_TYPE,
  DEFAULT_MEMORY_MB,
  DEFAULT_NUM_CPUS,
  DEFAULT_TIME_LIMIT_MINUTES,
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
  const runningWorkspace = useRunningWorkspace();
  const runningWorkspaceExists = Boolean(runningWorkspace);

  const { handleStopWorkspace } = useWorkspacesList();
  const { startAndOpenWorkspace } = useLaunchWorkspace();
  const { isOpen, open, close, workspace, setWorkspace, dialogType, setDialogType } = useLaunchWorkspaceStore();

  const runningWorkspaceIsCurrentWorkpace = runningWorkspace?.id === workspace?.id;

  const { toastErrorStopWorkspace, toastErrorLaunchWorkspace } = useWorkspaceToasts();

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
    setDialogType(null);
  }, [close, reset, setDialogType]);

  const submit = useCallback(
    async ({ workspaceJobTypeId, workspaceResourceOptions }: LaunchWorkspaceFormTypes) => {
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

      await startAndOpenWorkspace({
        jobTypeId: workspaceJobTypeId,
        workspace,
        resourceOptions: workspaceResourceOptions,
      });
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
      const workspaceResourceOptions = getWorkspaceResourceOptions(newWorkspace);

      if (isRunningWorkspace(newWorkspace)) {
        submit({ workspaceJobTypeId, workspaceResourceOptions }).catch((e) => {
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
    dialogType,
    setDialogType,
  };
}

export { useLaunchWorkspaceDialog };
