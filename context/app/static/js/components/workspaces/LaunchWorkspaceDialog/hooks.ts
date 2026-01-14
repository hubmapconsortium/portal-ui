import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEventCallback } from '@mui/material/utils';
import { z } from 'zod';

import { useLaunchWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { workspaceJobTypeIdField, workspaceResourceOptionsField } from 'js/components/workspaces/workspaceFormFields';
import { useLaunchWorkspace, useRunningWorkspaces, useWorkspacesList } from 'js/components/workspaces/hooks';
import {
  DEFAULT_GPU_ENABLED,
  DEFAULT_JOB_TYPE,
  DEFAULT_MEMORY_MB,
  DEFAULT_NUM_CPUS,
  DEFAULT_TIME_LIMIT_MINUTES,
  YAC_JOB_TYPE,
} from 'js/components/workspaces/constants';
import { MergedWorkspace, Workspace, WorkspaceResourceOptions } from 'js/components/workspaces/types';
import { findBestJobType, getWorkspaceResourceOptions, isRunningWorkspace } from 'js/components/workspaces/utils';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';

export interface LaunchWorkspaceFormTypes {
  workspaceToLaunch: Workspace;
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
  const runningWorkspaces = useRunningWorkspaces();
  const { startAndOpenWorkspace } = useLaunchWorkspace();
  const { handleStopWorkspace, handleDeleteWorkspace } = useWorkspacesList();
  const { isOpen, open, close, workspace, setWorkspace, dialogType, setDialogType } = useLaunchWorkspaceStore();

  const currentWorkspaceIsRunning = runningWorkspaces?.some((ws) => ws.id === workspace?.id);

  const { toastErrorLaunchWorkspace, toastErrorDeleteWorkspaces, toastSuccessStopWorkspace } = useWorkspaceToasts();

  const { control, handleSubmit, isSubmitting, reset, setValue } = useLaunchWorkspaceForm();

  const [showYACConflictDialog, setShowYACConflictDialog] = useState(false);
  const [pendingLaunchData, setPendingLaunchData] = useState<LaunchWorkspaceFormTypes | null>(null);
  const [existingYACWorkspace, setExistingYACWorkspace] = useState<MergedWorkspace | null>(null);

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
    async ({ workspaceToLaunch, workspaceJobTypeId, workspaceResourceOptions }: LaunchWorkspaceFormTypes) => {
      if (!workspace) {
        console.error('No workspace to run found.');
        return;
      }

      // Check if we're launching a YAC workspace and there's already ANY YAC workspace (different from current)
      if (workspaceJobTypeId === YAC_JOB_TYPE && runningWorkspaces) {
        const conflictingYACWorkspace = runningWorkspaces.find(
          (ws) =>
            ws.id !== workspace.id &&
            (ws.default_job_type === YAC_JOB_TYPE || ws.jobs.some((job) => job.job_type === YAC_JOB_TYPE)),
        );
        if (conflictingYACWorkspace) {
          // Show confirmation dialog to delete the existing YAC workspace
          setPendingLaunchData({ workspaceToLaunch, workspaceJobTypeId, workspaceResourceOptions });
          setExistingYACWorkspace(conflictingYACWorkspace);
          setShowYACConflictDialog(true);
          return;
        }
      }

      await startAndOpenWorkspace({
        jobTypeId: workspaceJobTypeId,
        workspace: workspaceToLaunch,
        resourceOptions: workspaceResourceOptions,
      });
    },
  );

  const launchOrOpenDialog = useEventCallback((workspaceToLaunch: MergedWorkspace) => {
    setWorkspace(workspaceToLaunch);
    const workspaceJobTypeId = findBestJobType(workspaceToLaunch.jobs);
    const workspaceResourceOptions = getWorkspaceResourceOptions(workspaceToLaunch);

    if (isRunningWorkspace(workspaceToLaunch)) {
      // If the workspace is already running, open it
      submit({ workspaceJobTypeId, workspaceResourceOptions, workspaceToLaunch }).catch((e) => {
        toastErrorLaunchWorkspace();
        console.error(e);
      });
    } else {
      // If the workspace is not running, open the dialog to launch it
      open();
    }
  });

  const handleYACConflictClose = useCallback(() => {
    setShowYACConflictDialog(false);
    setPendingLaunchData(null);
    setExistingYACWorkspace(null);
  }, []);

  const handleYACConflictConfirm = useEventCallback(async () => {
    if (!pendingLaunchData || !existingYACWorkspace) {
      console.error('Missing pending launch data or existing workspace');
      return;
    }

    try {
      // Stop the workspace if it's running
      const isRunning = existingYACWorkspace.jobs.some((job) => job.status === 'running' || job.status === 'pending');
      if (isRunning) {
        await handleStopWorkspace(existingYACWorkspace.id);
        toastSuccessStopWorkspace(existingYACWorkspace.name);
      }

      // Delete the existing YAC workspace
      await handleDeleteWorkspace(existingYACWorkspace.id);

      // Now launch the new workspace
      await startAndOpenWorkspace({
        jobTypeId: pendingLaunchData.workspaceJobTypeId,
        workspace: pendingLaunchData.workspaceToLaunch,
        resourceOptions: pendingLaunchData.workspaceResourceOptions,
      });

      setShowYACConflictDialog(false);
      setPendingLaunchData(null);
      setExistingYACWorkspace(null);
    } catch (error) {
      console.error('Error deleting existing YAC workspace:', error);
      toastErrorDeleteWorkspaces(existingYACWorkspace.name);
      toastErrorLaunchWorkspace();
      setShowYACConflictDialog(false);
      setPendingLaunchData(null);
      setExistingYACWorkspace(null);
    }
  });

  const runningYACWorkspace =
    existingYACWorkspace ??
    (runningWorkspaces
      ? (runningWorkspaces.find(
          (ws) => ws.default_job_type === YAC_JOB_TYPE || ws.jobs.some((job) => job.job_type === YAC_JOB_TYPE),
        ) ?? null)
      : null);

  return {
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
    showYACConflictDialog,
    handleYACConflictClose,
    handleYACConflictConfirm,
    runningYACWorkspace,
  };
}

export { useLaunchWorkspaceDialog };
