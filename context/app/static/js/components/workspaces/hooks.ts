import { useCallback, useMemo } from 'react';
import { KeyedMutator, useSWRConfig } from 'swr';
import { useEventCallback } from '@mui/material/utils';

import { useLaunchWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { useAppContext } from 'js/components/Contexts';
import { multiFetcher } from 'js/helpers/swr';
import { useWorkspaceTemplates } from 'js/components/workspaces/NewWorkspaceDialog/hooks';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import {
  getWorkspaceStartLink,
  mergeJobsIntoWorkspaces,
  findBestJob,
  getWorkspaceFileName,
  buildDatasetSymlinks,
  getDefaultJobType,
  getWorkspaceResourceOptions,
  tooManyWorkspacesRunning,
} from './utils';
import {
  useDeleteWorkspace,
  useStartWorkspace,
  useWorkspaces,
  useJobs,
  useCreateWorkspace,
  CreateWorkspaceBody,
  useWorkspace,
  useUpdateWorkspace,
  UpdateWorkspaceBody,
  useWorkspacesApiURLs,
  useBuildWorkspacesSWRKey,
  useInvitations,
  useDeleteInvitation,
  useShareInvitation,
  useAcceptInvitation,
  useInvitation,
  useStopWorkspaces,
} from './api';
import {
  MergedWorkspace,
  Workspace,
  CreateTemplatesResponse,
  WorkspaceResourceOptions,
  WorkspaceInvitation,
  WorkspaceFile,
  WorkspaceCreatorInfo,
} from './types';

interface UseWorkspacesListTypes<T> {
  workspaces: Workspace[];
  workspacesLoading: boolean;
  mutateWorkspace?: KeyedMutator<T>;
}

interface handleStartWorkspaceProps {
  workspaceId: number;
  jobTypeId: string;
  resourceOptions: WorkspaceResourceOptions;
}

interface startWorkspaceProps {
  workspace: Workspace;
  jobTypeId: string;
  resourceOptions: WorkspaceResourceOptions;
  templatePath?: string;
}

interface createAndLaunchWorkspaceProps {
  body: CreateWorkspaceBody;
  templatePath: string;
  resourceOptions: WorkspaceResourceOptions;
}

/**
 * Returns a function that will mutate workspaces, jobs, invitations, and optionally a single workspace's details
 *
 * @param mutateWorkspace The mutate function for a single workspace
 * @returns A function that will revalidate workspaces, jobs, invitations, and optionally a workspace
 */
function useMutateWorkspacesAndJobs<T>(mutateWorkspace?: KeyedMutator<T>) {
  const { mutate: mutateJobs } = useJobs();
  const { mutate: mutateWorkspaces } = useWorkspaces();
  const { mutate: mutateInvitations } = useInvitations();
  const mutate = useCallback(async () => {
    await Promise.all([mutateWorkspaces(), mutateJobs(), mutateInvitations(), mutateWorkspace?.()]);
  }, [mutateWorkspaces, mutateJobs, mutateInvitations, mutateWorkspace]);

  return mutate;
}

function useGlobalMutateWorkspace() {
  const { buildKey } = useBuildWorkspacesSWRKey();
  const urls = useWorkspacesApiURLs();
  const { mutate } = useSWRConfig();

  return useCallback(
    async (workspaceId: number) => {
      await mutate(buildKey({ url: urls.workspace(workspaceId) }));
    },
    [buildKey, urls, mutate],
  );
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
  const { stopWorkspaces, isStoppingWorkspace } = useStopWorkspaces();
  const { startWorkspace, isStartingWorkspace } = useStartWorkspace();

  async function handleDeleteWorkspace(workspaceId: number) {
    await deleteWorkspace(workspaceId);
    await mutate();
  }

  async function handleStopWorkspaces(workspaceIds: number[]) {
    await stopWorkspaces(workspaceIds);
    await mutate();
  }

  async function handleStopWorkspace(workspaceId: number) {
    await stopWorkspaces([workspaceId]);
    await mutate();
  }

  async function handleStartWorkspace({ workspaceId, jobTypeId, resourceOptions }: handleStartWorkspaceProps) {
    await startWorkspace({ workspaceId, jobTypeId, resourceOptions });
    await mutate();
  }

  return {
    workspacesList,
    handleDeleteWorkspace,
    handleStopWorkspace,
    handleStopWorkspaces,
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

function useInvitationsActions({
  sentInvitations,
  receivedInvitations,
  invitationsLoading,
}: {
  sentInvitations: WorkspaceInvitation[];
  receivedInvitations: WorkspaceInvitation[];
  invitationsLoading: boolean;
}) {
  const mutate = useMutateWorkspacesAndJobs();

  const { deleteInvitation, isDeleting } = useDeleteInvitation();
  const { acceptInvitation, isAccepting } = useAcceptInvitation();
  const { shareInvitation, isSharing } = useShareInvitation();

  async function handleDeleteInvitation(invitationId: number) {
    await deleteInvitation(invitationId);
    await mutate();
  }

  async function handleAcceptInvitation(invitationId: number) {
    await acceptInvitation(invitationId);
    await mutate();
  }

  async function handleShareInvitations({ workspaceIds, userIds }: { workspaceIds: string[]; userIds: number[] }) {
    await Promise.all(
      workspaceIds.map((workspaceId) =>
        shareInvitation({ original_workspace_id: workspaceId, shared_user_ids: userIds }),
      ),
    );
    await mutate();
  }

  const numPendingReceivedInvitations = receivedInvitations.filter((invitation) => !invitation.is_accepted).length;

  return {
    sentInvitations,
    receivedInvitations,
    invitationsLoading,
    handleDeleteInvitation,
    isDeleting,
    handleAcceptInvitation,
    isAccepting,
    handleShareInvitations,
    isSharing,
    numPendingReceivedInvitations,
  };
}

function useInvitationsList() {
  const { sentInvitations, receivedInvitations, isLoading: invitationsLoading } = useInvitations();
  return useInvitationsActions({
    sentInvitations,
    receivedInvitations,
    invitationsLoading,
  });
}

function useGetCreatorInfo(receivedInvitations: WorkspaceInvitation[]) {
  const creatorMap = receivedInvitations.reduce<Map<number, WorkspaceCreatorInfo>>((map, invitation) => {
    const workspaceId = invitation.shared_workspace_id.id;
    const original = invitation.original_workspace_id;

    map.set(workspaceId, original ? original.user_id : 'Unknown');
    return map;
  }, new Map());

  const getCreatorInfo = (workspaceId: number): WorkspaceCreatorInfo => creatorMap.get(workspaceId) ?? 'Me';

  return { getCreatorInfo };
}

function useWorkspacesListWithSharerInfo() {
  const { workspacesList, isLoading: workspacesLoading, ...rest } = useWorkspacesList();
  const { receivedInvitations, invitationsLoading } = useInvitationsList();

  const { getCreatorInfo } = useGetCreatorInfo(receivedInvitations);

  const workspacesWithCreatorInfo = workspacesList.map((workspace) => ({
    ...workspace,
    creatorInfo: getCreatorInfo(workspace.id),
  }));

  return {
    workspacesList: workspacesWithCreatorInfo,
    isLoading: workspacesLoading || invitationsLoading,
    ...rest,
  };
}

function getWorkspaceDatasetUUIDs(workspace: MergedWorkspace | Record<string, never> = {}) {
  // TODO: Update to use dataset IDs once workspace API makes them available
  const symlinks = workspace?.workspace_details?.current_workspace_details?.symlinks ?? [];
  return symlinks.reduce<string[]>((acc, symlink) => {
    const uuid = getWorkspaceFileName(symlink).split('/').pop();
    if (uuid) {
      return [...acc, uuid];
    }
    return acc;
  }, []);
}

function useMatchingWorkspaceTemplates(workspaceFiles: WorkspaceFile[] = []) {
  // TODO: Update to use template IDs once workspace API makes them available
  const { templates } = useWorkspaceTemplates();

  const matchingTemplates = workspaceFiles.reduce((acc, file) => {
    // match the filename without extension given a file path.
    const regex = /[\w-]+?(?=\.)/;
    const fileNameMatch = regex.exec(getWorkspaceFileName(file));
    const templateName = fileNameMatch ? fileNameMatch[0] : '';
    if (templateName && templateName in templates) {
      return { ...acc, [templateName]: templates[templateName] };
    }
    return acc;
  }, {});

  return matchingTemplates;
}

function useWorkspaceDetail({ workspaceId }: { workspaceId: number }) {
  const { workspace, isLoading: workspacesLoading } = useWorkspace(workspaceId);
  const { workspacesList, ...rest } = useWorkspacesActions({
    workspaces: Object.keys(workspace).length > 0 ? [workspace] : [],
    workspacesLoading,
  });

  const mergedWorkspace = workspacesList[0] ?? {};

  const workspaceTemplates = useMatchingWorkspaceTemplates(
    mergedWorkspace.workspace_details?.current_workspace_details?.files,
  );

  return {
    workspace: mergedWorkspace,
    workspaceDatasets: getWorkspaceDatasetUUIDs(mergedWorkspace),
    workspaceTemplates,
    ...rest,
  };
}

function useInvitationDetail({ invitationId }: { invitationId: number }) {
  const {
    invitation,
    sentInvitations,
    receivedInvitations,
    isLoading: invitationsLoading,
  } = useInvitation(invitationId);
  const invitationsActions = useInvitationsActions({
    sentInvitations,
    receivedInvitations,
    invitationsLoading,
  });

  const workspaceDetails = invitation?.shared_workspace_id?.workspace_details;
  const invitationTemplates = useMatchingWorkspaceTemplates(workspaceDetails?.current_workspace_details?.files);
  const invitationDatasets: string[] =
    workspaceDetails?.request_workspace_details?.symlinks?.flatMap((symlink) =>
      symlink.dataset_uuid ? [symlink.dataset_uuid] : [],
    ) ?? [];

  return {
    invitation,
    invitationDatasets,
    invitationTemplates,
    ...invitationsActions,
  };
}

function useInvitationWorkspaceDetails({ workspaceId }: { workspaceId: number }) {
  const { workspace, ...rest } = useWorkspaceDetail({ workspaceId });
  const { sentInvitations, receivedInvitations } = useInvitationsList();

  const { getCreatorInfo } = useGetCreatorInfo(receivedInvitations);
  const creatorInfo = getCreatorInfo(workspaceId);

  const workspaceSentInvitations = sentInvitations.filter(
    (invitation) => invitation.original_workspace_id?.id === workspaceId,
  );

  return {
    workspace,
    creatorInfo,
    workspaceSentInvitations,
    ...rest,
  };
}

function useRunningWorkspaces() {
  const { workspacesList } = useWorkspacesList();
  return workspacesList.filter((workspace) =>
    workspace.jobs.some((job) => job.status === 'running' || job.status === 'pending'),
  );
}

function useHasRunningWorkspace() {
  return Boolean(useRunningWorkspaces());
}

function useHandleUpdateWorkspace() {
  const { updateWorkspace } = useUpdateWorkspace();
  const mutateWorkspacesAndJobs = useMutateWorkspacesAndJobs();
  const globalMutateWorkspace = useGlobalMutateWorkspace();

  const handleUpdateWorkspace = useCallback(
    async ({ body, workspaceId }: { body: UpdateWorkspaceBody; workspaceId: number }) => {
      try {
        await updateWorkspace({ body, workspaceId });
        await mutateWorkspacesAndJobs();
        await globalMutateWorkspace(workspaceId);
      } catch (e) {
        console.error(e);
      }
    },
    [updateWorkspace, mutateWorkspacesAndJobs, globalMutateWorkspace],
  );

  return { handleUpdateWorkspace };
}

function useLaunchWorkspace() {
  const { startWorkspace } = useStartWorkspace();
  const runningWorkspaces = useRunningWorkspaces();
  const mutateWorkspacesAndJobs = useMutateWorkspacesAndJobs();
  const globalMutateWorkspace = useGlobalMutateWorkspace();
  const { open, setWorkspace, setDialogType } = useLaunchWorkspaceStore();

  const { handleUpdateWorkspace } = useHandleUpdateWorkspace();
  const { toastSuccessLaunchWorkspace, toastSuccessCreateWorkspace } = useWorkspaceToasts();

  const startAndOpenWorkspace = useEventCallback(
    async ({ workspace, jobTypeId, resourceOptions, templatePath }: startWorkspaceProps) => {
      const isNewJobType = workspace?.default_job_type !== jobTypeId;
      const currentWorkspaceIsRunning = runningWorkspaces.find((ws) => ws.id === workspace.id);

      if (runningWorkspaces && currentWorkspaceIsRunning && !isNewJobType) {
        window.open(getWorkspaceStartLink(workspace, templatePath), '_blank');
        return;
      }

      await startWorkspace({ workspaceId: workspace.id, jobTypeId, resourceOptions });
      await mutateWorkspacesAndJobs();
      await globalMutateWorkspace(workspace.id);
      window.open(getWorkspaceStartLink(workspace, templatePath), '_blank');

      if (isNewJobType) {
        await handleUpdateWorkspace({ workspaceId: workspace.id, body: { default_job_type: jobTypeId } });
      }

      toastSuccessLaunchWorkspace(workspace.id);
    },
  );

  const startNewWorkspace = useEventCallback(
    async ({ workspace, jobTypeId, resourceOptions, templatePath }: startWorkspaceProps) => {
      if (tooManyWorkspacesRunning(runningWorkspaces)) {
        open();
        setWorkspace(workspace);
        toastSuccessCreateWorkspace();
      } else {
        await startAndOpenWorkspace({ workspace, jobTypeId, templatePath, resourceOptions });
        setDialogType(null);
      }
    },
  );

  return { startNewWorkspace, startAndOpenWorkspace };
}

export function useCreateAndLaunchWorkspace() {
  const { createWorkspace, isCreatingWorkspace } = useCreateWorkspace();
  const { startNewWorkspace } = useLaunchWorkspace();
  const { toastErrorCreateWorkspace, toastErrorLaunchWorkspace, toastSuccessLaunchWorkspace } = useWorkspaceToasts();

  const createAndLaunchWorkspace = useCallback(
    async ({ body, templatePath, resourceOptions }: createAndLaunchWorkspaceProps) => {
      let workspace: Workspace;

      try {
        workspace = await createWorkspace(body);
      } catch {
        toastErrorCreateWorkspace();
        return;
      }

      toastSuccessLaunchWorkspace(workspace.id);

      try {
        await startNewWorkspace({
          workspace,
          jobTypeId: body.default_job_type,
          templatePath,
          resourceOptions,
        });
      } catch {
        toastErrorLaunchWorkspace();
      }
    },
    [
      createWorkspace,
      startNewWorkspace,
      toastErrorCreateWorkspace,
      toastSuccessLaunchWorkspace,
      toastErrorLaunchWorkspace,
    ],
  );

  return { createAndLaunchWorkspace, isCreatingWorkspace, toastErrorLaunchWorkspace };
}

function getWorkspaceTimeLeft(workspace: MergedWorkspace) {
  return findBestJob(workspace?.jobs ?? [])?.job_details?.current_job_details?.time_left;
}

function useSessionWarning(workspaces: MergedWorkspace[]) {
  const allWorkspacesAreRunning = workspaces.every((ws) =>
    ws.jobs.some((job) => job.status === 'running' || job.status === 'pending'),
  );

  if (!allWorkspacesAreRunning || workspaces.length === 0) {
    return false;
  }

  const multipleWorkspaces = workspaces.length > 1;

  const timeRemainingText = !multipleWorkspaces
    ? (() => {
        const timeLeft = getWorkspaceTimeLeft(workspaces[0]);
        if (typeof timeLeft === 'number') {
          const minutes = Math.floor(timeLeft / 60);
          return ` You have ${minutes} minute${minutes !== 1 ? 's' : ''} left in your session.`;
        }
        return '';
      })()
    : '';

  return `${multipleWorkspaces ? 'are' : 'is'} currently running.${timeRemainingText} Renewing your session time${multipleWorkspaces ? 's' : ''} will stop all jobs running in your workspaces.`;
}

function useRefreshSessions(workspaces: MergedWorkspace[]) {
  const { stopWorkspaces, isStoppingWorkspace } = useStopWorkspaces();
  const { startWorkspace, isStartingWorkspace } = useStartWorkspace();
  const { toastSuccessRenewSession } = useWorkspaceToasts();

  const mutate = useMutateWorkspacesAndJobs();
  const workspaceIds = workspaces.map((workspace) => workspace.id);

  const refreshSessions = useEventCallback(async () => {
    await stopWorkspaces(workspaceIds);

    await Promise.all(
      workspaces.map((workspace) =>
        startWorkspace({
          workspaceId: workspace.id,
          jobTypeId: getDefaultJobType({ workspace }),
          resourceOptions: getWorkspaceResourceOptions(workspace),
        }),
      ),
    );

    await mutate();
    toastSuccessRenewSession();
  });

  return { refreshSessions, isRefreshingSessions: isStoppingWorkspace || isStartingWorkspace };
}

function useCreateTemplates() {
  const { userTemplatesEndpoint } = useAppContext();

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
      return templateKeys.map((templateKey, i) => ({
        name: `${templateKey}.ipynb`,
        content: createdTemplates[i]?.data?.template,
      }));
    },
    [userTemplatesEndpoint],
  );

  return { createTemplates };
}

function useUpdateWorkspaceDatasets({ workspaceId }: { workspaceId: number }) {
  const { groupsToken } = useAppContext();
  const { handleUpdateWorkspace } = useHandleUpdateWorkspace();

  return useCallback(
    async ({ datasetUUIDs }: { datasetUUIDs: string[] }) => {
      await handleUpdateWorkspace({
        workspaceId,
        body: {
          workspace_details: {
            globus_groups_token: groupsToken,
            symlinks: buildDatasetSymlinks({ datasetUUIDs }),
          },
        },
      });
    },
    [handleUpdateWorkspace, groupsToken, workspaceId],
  );
}

export {
  useWorkspacesList,
  useInvitationsList,
  useHasRunningWorkspace,
  useRunningWorkspaces,
  useLaunchWorkspace,
  useWorkspaceDetail,
  useInvitationDetail,
  useInvitationWorkspaceDetails,
  useSessionWarning,
  useRefreshSessions,
  useHandleUpdateWorkspace,
  useCreateTemplates,
  useUpdateWorkspaceDatasets,
  useWorkspacesListWithSharerInfo,
};
