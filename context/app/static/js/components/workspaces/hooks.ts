import { useCallback, useMemo } from 'react';
import { KeyedMutator } from 'swr';
import { getWorkspaceStartLink, mergeJobsIntoWorkspaces, findBestJob } from './utils';
import {
  useDeleteWorkspace,
  useStopWorkspace,
  useStartWorkspace,
  useWorkspaces,
  useJobs,
  useCreateWorkspace,
  CreateWorkspaceBody,
  useWorkspace,
} from './api';
import { MergedWorkspace, Workspace } from './types';
import { useLaunchWorkspaceStore } from './LaunchWorkspaceDialog/store';

interface UseWorkspacesListTypes<T> {
  workspaces: Workspace[];
  workspacesLoading: boolean;
  mutateWorkspaces: KeyedMutator<T>;
}

function useWorkspacesActions<T>({ workspaces, workspacesLoading, mutateWorkspaces }: UseWorkspacesListTypes<T>) {
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

function useWorkspacesList() {
  const { workspaces, isLoading: workspacesLoading, mutate: mutateWorkspaces } = useWorkspaces();
  return useWorkspacesActions({
    workspaces,
    workspacesLoading,
    mutateWorkspaces,
  });
}

function useWorkspaceDetail({ workspaceId }: { workspaceId: number }) {
  const { workspace, isLoading: workspacesLoading, mutate: mutateWorkspaces } = useWorkspace(workspaceId);
  const { workspacesList, ...rest } = useWorkspacesActions({
    workspaces: Object.keys(workspace).length > 0 ? [workspace] : [],
    workspacesLoading,
    mutateWorkspaces,
  });

  const mergedWorkspace = workspacesList[0] ?? {};

  return { workspace: mergedWorkspace, ...rest };
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

  const startAndOpenWorkspace = useCallback(
    async (ws: Workspace, templatePath?: string) => {
      await startWorkspace(ws.id);
      await mutate();
      window.open(getWorkspaceStartLink(ws, templatePath), '_blank');
    },
    [mutate, startWorkspace],
  );

  const launchWorkspace = useCallback(
    async (ws: Workspace, templatePath?: string) => {
      if (runningWorkspace && ws.id === runningWorkspace.id) {
        window.open(getWorkspaceStartLink(ws, templatePath), '_blank');
        return;
      }
      if (runningWorkspace) {
        open();
        setWorkspace(ws);
        throw new Error('Another workspace is already running');
      } else {
        await startAndOpenWorkspace(ws, templatePath);
      }
    },
    [open, runningWorkspace, setWorkspace, startAndOpenWorkspace],
  );

  const handleLaunchWorkspace = useCallback(async () => {
    if (workspace) {
      try {
        return await launchWorkspace(workspace);
      } catch (err: unknown) {
        if ((err as Error)?.message === 'Another workspace is already running') {
          return undefined;
        }
        console.error(err);
      }
    }
    return Promise.reject(new Error('No workspace to launch'));
  }, [workspace, launchWorkspace]);

  return { handleLaunchWorkspace, launchWorkspace, startAndOpenWorkspace };
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
        await launchWorkspace(workspace, templatePath);
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

function getWorkspaceTimeLeft(workspace: MergedWorkspace) {
  return findBestJob(workspace?.jobs ?? [])?.job_details?.current_job_details?.time_left;
}
type FoundPair = [MergedWorkspace, number];

function useSessionWarning(workspaces: MergedWorkspace[]) {
  const [matchedWorkspace, timeLeft] = workspaces.reduce<FoundPair | undefined>((acc, ws) => {
  	if (acc) return acc; // Avoids extra calls to `getWorkspaceTimeLeft` after workspace has been found since we can't break a .reduce() 
    const time = getWorkspaceTimeLeft(ws);
    return time ? [ws, time]: acc; // If a time is found, return the workspace with time, otherwise continue iteration
  }, undefined);
  
  if (!matchedWorkspace || !timeLeft) {
  	return false;
  }

  return `${matchedWorkspace.name} is currently running. You have ${Math.floor(
    timeLeft / 60,
  )} minutes left in your session. Renewing your session time will stop all jobs running in your workspace.`;
}

export {
  useWorkspacesList,
  useHasRunningWorkspace,
  useRunningWorkspace,
  useLaunchWorkspace,
  useWorkspaceDetail,
  useSessionWarning,
};
