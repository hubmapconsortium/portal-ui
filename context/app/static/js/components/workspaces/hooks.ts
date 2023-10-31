import { useCallback, useMemo } from 'react';
import { mergeJobsIntoWorkspaces } from './utils';
import {
  useDeleteWorkspace,
  useStopWorkspace,
  useStartWorkspace,
  useWorkspaces,
  useJobs,
  useCreateWorkspace,
  CreateWorkspaceBody,
} from './api';
import { MergedWorkspace, Workspace } from './types';
import { useLaunchWorkspaceStore } from './LaunchWorkspaceDialog/store';

function useWorkspacesList() {
  const { workspaces, isLoading: workspacesLoading, mutate: mutateWorkspaces } = useWorkspaces();
  const { jobs, isLoading: jobsLoading, mutate: mutateJobs } = useJobs();
  const isLoading = workspacesLoading || jobsLoading;
  const mutate = useCallback(async () => {
    await Promise.all([mutateWorkspaces(), mutateJobs()]);
  }, [mutateWorkspaces, mutateJobs]);

  const workspacesList: MergedWorkspace[] = useMemo(
    () => (jobs?.length && workspaces?.length ? mergeJobsIntoWorkspaces(jobs, workspaces) : []),
    [jobs, workspaces],
  );

  const { deleteWorkspace, isDeleting } = useDeleteWorkspace();
  const { stopWorkspace, isStoppingWorkspace } = useStopWorkspace();
  const { startWorkspace, isStartingWorkspace } = useStartWorkspace();

  async function handleDeleteWorkspace(workspaceId: number) {
    await deleteWorkspace(workspaceId);
    await mutate();
  }

  async function handleStopWorkspace(workspaceId: number) {
    await stopWorkspace(workspaceId);
    await mutate();
  }

  async function handleStartWorkspace(workspaceId: number) {
    await startWorkspace(workspaceId);
    await mutate();
  }

  return {
    workspacesList,
    handleDeleteWorkspace,
    handleStopWorkspace,
    handleStartWorkspace,
    isLoading,
    isDeleting,
    isStoppingWorkspace,
    isStartingWorkspace,
  };
}

function useRunningWorkspace() {
  const { workspacesList } = useWorkspacesList();
  return workspacesList.find((workspace) => workspace.jobs.some((job) => job.status === 'running'));
}

function useHasRunningWorkspace() {
  return Boolean(useRunningWorkspace());
}

function useLaunchWorkspace(workspace?: Workspace) {
  const { startWorkspace } = useStartWorkspace();
  const { mutate: mutateWorkspaces } = useWorkspaces();
  const { mutate: mutateJobs } = useJobs();
  const runningWorkspace = useRunningWorkspace();
  const mutate = useCallback(async () => {
    await Promise.all([mutateWorkspaces(), mutateJobs()]);
  }, [mutateWorkspaces, mutateJobs]);

  const { open, setWorkspace } = useLaunchWorkspaceStore();

  const launchWorkspace = useCallback(
    async (ws: Workspace) => {
      if (runningWorkspace) {
        open();
        setWorkspace(ws);
        throw new Error('Another workspace is already running');
      } else {
        await startWorkspace(ws.id);
        await mutate();
      }
    },
    [mutate, open, runningWorkspace, setWorkspace, startWorkspace],
  );

  const handleLaunchWorkspace = useCallback(async () => {
    if (workspace) {
      return launchWorkspace(workspace);
    }
    return Promise.reject(new Error('No workspace to launch'));
  }, [workspace, launchWorkspace]);

  return { handleLaunchWorkspace, launchWorkspace };
}

export function useCreateAndLaunchWorkspace() {
  const { createWorkspace, isCreatingWorkspace } = useCreateWorkspace();
  const { launchWorkspace } = useLaunchWorkspace();

  const createAndLaunchWorkspace = useCallback(
    async ({ body, templatePath }: { body: CreateWorkspaceBody; templatePath: string }) => {
      const workspace = await createWorkspace(body);

      if (!workspace.id) {
        throw new Error('Failed to create workspace');
      }

      try {
        await launchWorkspace(workspace);
        window.open(`/workspaces/${workspace.id}?notebook_path=${encodeURIComponent(templatePath)}`, '_blank');
      } catch (err: unknown) {
        if ((err as Error)?.message === 'Another workspace is already running') {
          return;
        }
        console.error(err);
      }
    },
    [createWorkspace, launchWorkspace],
  );

  return { createAndLaunchWorkspace, isCreatingWorkspace };
}

export { useWorkspacesList, useHasRunningWorkspace, useRunningWorkspace, useLaunchWorkspace };
