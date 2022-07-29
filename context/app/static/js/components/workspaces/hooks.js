import { useContext, useState, useEffect } from 'react';

import { AppContext } from 'js/components/Providers';

function useWorkspacesList() {
  const [workspacesList, setWorkspacesList] = useState([]);
  // TODO: isLoading:
  // const [isLoading, setIsLoading] = useState(true);

  const { workspacesEndpoint, workspacesToken } = useContext(AppContext);

  useEffect(() => {
    async function getAndSetWorkspacesList() {
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

      // console.log(workspaceResults, jobsResults);

      const { workspaces } = workspaceResults.data;
      const { jobs } = jobsResults.data;

      const wsIdToJobs = {};
      jobs.forEach((job) => {
        const { workspace_id } = job;
        if (!(workspace_id in wsIdToJobs)) {
          wsIdToJobs[workspace_id] = [];
        }
        wsIdToJobs[workspace_id].push(job);
      });

      workspaces.forEach((workspace) => {
        // eslint-disable-next-line no-param-reassign
        workspace.jobs = wsIdToJobs?.[workspace.id] || [];
      });

      setWorkspacesList(workspaces);
      // TODO:
      // setIsLoading(false);
    }
    getAndSetWorkspacesList();
  }, [workspacesEndpoint, workspacesToken]);

  return { workspacesList };
}

export { useWorkspacesList };
