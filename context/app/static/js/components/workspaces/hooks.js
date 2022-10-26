import { useContext, useState, useEffect, useCallback } from 'react';

import { AppContext } from 'js/components/Providers';

import { mergeJobsIntoWorkspaces, createEmptyWorkspace, deleteWorkspace, stopJobs } from './utils';

function useWorkspacesList() {
  const [workspacesList, setWorkspacesList] = useState([]);
  // TODO: isLoading:
  // const [isLoading, setIsLoading] = useState(true);

  const { workspacesEndpoint, workspacesToken } = useContext(AppContext);
  const getAndSetWorkspaces = useCallback(async () => {
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
      return;
    }

    // This is could be parallelized too...
    // but since it's not network-bound, little benefit.
    const workspaceResults = await workspacesResponse.json();
    const jobsResults = await jobsResponse.json();

    const workspaces = mergeJobsIntoWorkspaces(jobsResults.data.jobs, workspaceResults.data.workspaces);

    setWorkspacesList(workspaces);
  }, [workspacesEndpoint, workspacesToken]);

  async function handleDeleteWorkspace(workspaceId) {
    await deleteWorkspace({ workspaceId, workspacesEndpoint, workspacesToken });
    getAndSetWorkspaces();
  }

  async function handleStopWorkspace(workspaceId) {
    await stopJobs({ workspaceId, workspacesEndpoint, workspacesToken });
    getAndSetWorkspaces();
  }

  async function handleCreateWorkspace() {
    await createEmptyWorkspace({
      workspacesEndpoint,
      workspacesToken,
      workspaceName: 'TODO: prompt for name',
      workspaceDescription: 'TODO: description',
    });
    getAndSetWorkspaces();
  }

  useEffect(() => getAndSetWorkspaces(), [getAndSetWorkspaces]);

  return { workspacesList, handleDeleteWorkspace, handleCreateWorkspace, handleStopWorkspace };
}

export { useWorkspacesList };
