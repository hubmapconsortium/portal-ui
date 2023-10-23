import useSWR from 'swr';

import { useAppContext } from 'js/components/Contexts';
import { mergeJobsIntoWorkspaces, createWorkspaceAndNotebook, deleteWorkspace, stopJobs, startJob } from './utils';
import { Workspace, WorkspaceAPIResponse, WorkspaceJob } from './types';

async function fetchWorkspaces(workspacesEndpoint: string, workspacesToken: string) {
  const fetchOpts = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'UWS-Authorization': `Token ${workspacesToken}`,
    },
  };

  const [workspacesResponse, jobsResponse] = await Promise.all([
    fetch(`${workspacesEndpoint}/workspaces`, fetchOpts),
    fetch(`${workspacesEndpoint}/jobs`, fetchOpts),
  ]);

  if (!workspacesResponse.ok || !jobsResponse.ok) {
    console.error('Workspaces API failed. Workspaces:', workspacesResponse, 'Jobs:', jobsResponse);
  }

  // This is could be parallelized too...
  // but since it's not network-bound, little benefit.
  const workspaceResults = (await workspacesResponse.json()) as WorkspaceAPIResponse<{ workspaces: Workspace[] }>;
  const jobsResults = (await jobsResponse.json()) as WorkspaceAPIResponse<{ jobs: WorkspaceJob[] }>;

  if (!workspaceResults.success || !jobsResults.success) {
    console.error('Workspaces API failed. Workspaces:', workspaceResults, 'Jobs:', jobsResults);
    return [];
  }

  return mergeJobsIntoWorkspaces(jobsResults.data.jobs, workspaceResults.data.workspaces);
}

function useWorkspacesList() {
  const { workspacesEndpoint, workspacesToken } = useAppContext();

  const { data: workspacesList, mutate } = useSWR(
    ['workspaces', workspacesToken],
    ([, token]: [string, string]) => fetchWorkspaces(workspacesEndpoint, token),
    { fallbackData: [], revalidateOnFocus: true },
  );

  async function handleDeleteWorkspace(workspaceId: number) {
    await deleteWorkspace({ workspaceId, workspacesEndpoint, workspacesToken });
    await mutate();
  }

  async function handleStopWorkspace(workspaceId: number) {
    await stopJobs({ workspaceId, workspacesEndpoint, workspacesToken });
    await mutate();
  }

  async function handleCreateWorkspace({ workspaceName }: { workspaceName: string }) {
    await createWorkspaceAndNotebook({ path: 'blank.ipynb', body: { workspace_name: workspaceName } });
    await mutate();
  }

  async function handleStartWorkspace(workspaceId: number) {
    await startJob({ workspaceId, workspacesEndpoint, workspacesToken });
    await mutate();
  }

  return { workspacesList, handleDeleteWorkspace, handleCreateWorkspace, handleStopWorkspace, handleStartWorkspace };
}

function useCreateAndLaunchWorkspace() {
  const { workspacesEndpoint, workspacesToken } = useAppContext();
  return async function createAndLaunchWorkspace({ path, body }: { path: string; body: unknown }) {
    const { workspace_id, notebook_path } = await createWorkspaceAndNotebook({ path, body });
    await startJob({ workspaceId: workspace_id, workspacesEndpoint, workspacesToken });

    if (workspace_id && notebook_path) {
      window.open(`/workspaces/${workspace_id}?notebook_path=${encodeURIComponent(notebook_path)}`, '_blank');
    }
  };
}

export { useWorkspacesList, useCreateAndLaunchWorkspace };
