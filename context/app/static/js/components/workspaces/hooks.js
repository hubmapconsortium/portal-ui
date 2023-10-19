import useSWR from 'swr';

import { useAppContext } from 'js/components/Contexts';
import { mergeJobsIntoWorkspaces, createWorkspaceAndNotebook, deleteWorkspace, stopJobs, startJob } from './utils';

async function fetchWorkspaces(workspacesEndpoint, workspacesToken) {
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
  const workspaceResults = await workspacesResponse.json();
  const jobsResults = await jobsResponse.json();

  return mergeJobsIntoWorkspaces(jobsResults.data.jobs, workspaceResults.data.workspaces);
}

function useWorkspacesList() {
  const { workspacesEndpoint, workspacesToken } = useAppContext();

  const { data: workspacesList, mutate } = useSWR(
    ['workspaces', workspacesToken],
    ([, token]) => fetchWorkspaces(workspacesEndpoint, token),
    { fallbackData: [], revalidateOnFocus: true },
  );

  async function handleDeleteWorkspace(workspaceId) {
    await deleteWorkspace({ workspaceId, workspacesEndpoint, workspacesToken });
    mutate();
  }

  async function handleStopWorkspace(workspaceId) {
    await stopJobs({ workspaceId, workspacesEndpoint, workspacesToken });
    mutate();
  }

  async function handleCreateWorkspace({ workspaceName }) {
    await createWorkspaceAndNotebook({ path: 'blank.ipynb', body: { workspace_name: workspaceName } });
    mutate();
  }

  async function handleStartWorkspace(workspaceId) {
    await startJob({ workspaceId, workspacesEndpoint, workspacesToken });
    mutate();
  }

  return { workspacesList, handleDeleteWorkspace, handleCreateWorkspace, handleStopWorkspace, handleStartWorkspace };
}

function useCreateAndLaunchWorkspace() {
  const { workspacesEndpoint, workspacesToken } = useAppContext();
  return async function createAndLaunchWorkspace({ path, body }) {
    const { workspace_id, notebook_path } = await createWorkspaceAndNotebook({ path, body });
    await startJob({ workspaceId: workspace_id, workspacesEndpoint, workspacesToken });

    if (workspace_id && notebook_path) {
      window.open(`/workspaces/${workspace_id}?notebook_path=${encodeURIComponent(notebook_path)}`, '_blank');
    }
  };
}

export { useWorkspacesList, useCreateAndLaunchWorkspace };
