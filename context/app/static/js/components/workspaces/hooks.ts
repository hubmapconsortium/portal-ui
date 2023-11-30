import { useCallback, useMemo } from 'react';
import { KeyedMutator } from 'swr';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { useLaunchWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { useAppContext } from 'js/components/Contexts';
import { multiFetcher } from 'js/helpers/swr';
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
  useUpdateWorkspace,
  UpdateWorkspaceBody,
} from './api';
import { MergedWorkspace, Workspace, CreateTemplatesResponse } from './types';

interface UseWorkspacesListTypes<T> {
  workspaces: Workspace[];
  workspacesLoading: boolean;
  mutateWorkspace?: KeyedMutator<T>;
}

/**
 * Returns a function that will mutate workspaces, jobs, and optionally a single workspace's details
 *
 * @param mutateWorkspace The mutate function for a single workspace
 * @returns A function that will revalidate workspaces, jobs, and optionally a workspace
 */
function useMutateWorkspacesAndJobs<T>(mutateWorkspace?: KeyedMutator<T>) {
  const { mutate: mutateJobs } = useJobs();
  const { mutate: mutateWorkspaces } = useWorkspaces();
  const mutate = useCallback(async () => {
    await Promise.all([mutateWorkspaces(), mutateJobs(), mutateWorkspace?.()]);
  }, [mutateWorkspaces, mutateJobs, mutateWorkspace]);

  return mutate;
}

function useWorkspacesActions<T>({ workspaces, workspacesLoading, mutateWorkspace }: UseWorkspacesListTypes<T>) {
  const { jobs, isLoading: jobsLoading } = useJobs();
  const isLoading = workspacesLoading || jobsLoading;
  const mutate = useMutateWorkspacesAndJobs(mutateWorkspace);

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
  const { workspaces, isLoading: workspacesLoading } = useWorkspaces();
  return useWorkspacesActions({
    workspaces,
    workspacesLoading,
  });
}

function useWorkspaceDetail({ workspaceId }: { workspaceId: number }) {
  const { workspace, isLoading: workspacesLoading } = useWorkspace(workspaceId);
  const { workspacesList, ...rest } = useWorkspacesActions({
    workspaces: Object.keys(workspace).length > 0 ? [workspace] : [],
    workspacesLoading,
  });

  const mergedWorkspace = workspacesList[0] ?? {};

  return { workspace: mergedWorkspace, ...rest };
}

function useRunningWorkspace() {
  const { workspacesList } = useWorkspacesList();
  return workspacesList.find((workspace) =>
    workspace.jobs.some((job) => job.status === 'running' || job.status === 'pending'),
  );
}

function useHasRunningWorkspace() {
  return Boolean(useRunningWorkspace());
}

function useLaunchWorkspace(workspace?: Workspace) {
  const { startWorkspace } = useStartWorkspace();
  const { mutate: mutateWorkspaces } = useWorkspaces();
  const runningWorkspace = useRunningWorkspace();
  const mutate = useMutateWorkspacesAndJobs(mutateWorkspaces);

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
  const result = workspaces.reduce<FoundPair | undefined>((acc, ws) => {
    if (acc) return acc; // Avoids extra calls to `getWorkspaceTimeLeft` after workspace has been found since we can't break a .reduce()
    const time = getWorkspaceTimeLeft(ws);
    return time ? [ws, time] : acc; // If a time is found, return the workspace with time, otherwise continue iteration
  }, undefined);

  if (!result) {
    return false;
  }

  const [matchedWorkspace, timeLeft] = result;

  const warning = `is currently running. You have ${Math.floor(
    timeLeft / 60,
  )} minutes left in your session. Renewing your session time will stop all jobs running in your workspace.`;

  return {
    warning,
    matchedWorkspace,
  };
}

function useRefreshSession(workspace: MergedWorkspace) {
  const { stopWorkspace, isStoppingWorkspace } = useStopWorkspace();
  const { startWorkspace, isStartingWorkspace } = useStartWorkspace();
  const { mutate: mutateWorkspace } = useWorkspace(workspace.id);
  const mutate = useMutateWorkspacesAndJobs(mutateWorkspace);
  const { toastSuccess } = useSnackbarActions();
  const refreshSession = useCallback(async () => {
    await stopWorkspace(workspace.id);
    await startWorkspace(workspace.id);
    await mutate();
    toastSuccess('Session time for workspace successfully renewed');
  }, [mutate, startWorkspace, stopWorkspace, toastSuccess, workspace.id]);

  return { refreshSession, isRefreshingSession: isStoppingWorkspace || isStartingWorkspace };
}

function useHandleUpdateWorkspace({ workspaceId }: { workspaceId: number }) {
  const { mutate: mutateWorkspace } = useWorkspace(workspaceId);
  const { updateWorkspace } = useUpdateWorkspace({ workspaceId });
  const { toastSuccess, toastError } = useSnackbarActions();

  const handleUpdateWorkspace = useCallback(
    async (body: UpdateWorkspaceBody) => {
      try {
        await updateWorkspace(body);
        await mutateWorkspace();
        toastSuccess('Workspace successfully updated.');
      } catch (e) {
        toastError('Failed to update workspace.');
      }
    },
    [updateWorkspace, mutateWorkspace, toastSuccess, toastError],
  );

  return { handleUpdateWorkspace };
}

function useCreateTemplates() {
  const { userTemplatesEndpoint } = useAppContext();
  const { toastError } = useSnackbarActions();

  const createTemplates = useCallback(
    async ({ templateKeys, uuids }: { templateKeys: string[]; uuids: string[] }) => {
      const templateUrls = templateKeys.map((key) => `${userTemplatesEndpoint}/templates/jupyter_lab/${key}`);
      const createdTemplates = await multiFetcher<CreateTemplatesResponse>({
        urls: templateUrls,
        requestInits: [
          {
            method: 'POST',
            body: JSON.stringify({ uuids }),
            headers: { Authorization: `Bearer ${groupsToken}` },
          },
        ],
      });
      if (createdTemplates.some((t) => !t.success)) {
        const error = createdTemplates.reduce((acc, t) => acc.concat(t.message), '');
        toastError(error);
      }
      return templateKeys.map((templateKey, i) => ({
        name: `${templateKey}.ipynb`,
        content: createdTemplates[i]?.data?.template,
      }));
    },
    [toastError, userTemplatesEndpoint],
  );

  return { createTemplates };
}

export {
  useWorkspacesList,
  useHasRunningWorkspace,
  useRunningWorkspace,
  useLaunchWorkspace,
  useWorkspaceDetail,
  useSessionWarning,
  useRefreshSession,
  useHandleUpdateWorkspace,
  useCreateTemplates,
};
