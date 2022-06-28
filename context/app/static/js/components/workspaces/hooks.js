import { useContext, useState, useEffect, useCallback } from 'react';

import { AppContext } from 'js/components/Providers';

function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState([]);
  const { workspacesEndpoint, workspacesToken } = useContext(AppContext);
  const getAndSetWorkspaces = useCallback(async () => {
    const response = await fetch(`${workspacesEndpoint}/workspaces`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'UWS-Authorization': `Token ${workspacesToken}`,
      },
    });
    console.info('setWorkspaces:', response);
    setWorkspaces(response?.data?.workspaces || []);
  }, [workspacesEndpoint, workspacesToken]);

  async function updateWorkspaces() {
    // const response = await fetch();
    // if (!response.ok) {
    //   console.error('Update failed', response);
    //   return;
    // }
    getAndSetWorkspaces();
  }

  useEffect(() => {
    async function fetchData() {
      getAndSetWorkspaces();
    }
    fetchData();
  }, [getAndSetWorkspaces]);

  return { workspaces, updateWorkspaces };
}

// function useWorkspacesList() {
//   const [workspacesList, setWorkspacesList] = useState([]);
//   // TODO: isLoading:
//   // const [isLoading, setIsLoading] = useState(true);

//   const { workspacesEndpoint, workspacesToken } = useContext(AppContext);

//   useEffect(() => {
//     async function getAndSetWorkspacesList() {
//       const response = await fetch(`${workspacesEndpoint}/workspaces`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'UWS-Authorization': `Token ${workspacesToken}`,
//         },
//       });

//       if (!response.ok) {
//         console.error('Workspaces API failed', response);
//         return;
//       }
//       const results = await response.json();

//       setWorkspacesList(results.data.workspaces);
//       // TODO:
//       // setIsLoading(false);
//     }
//     getAndSetWorkspacesList();
//   }, [workspacesEndpoint, workspacesToken]);

//   return { workspacesList };
// }

function useJobsList() {
  // TODO: Right now the API does not support querying, so we just need to get the whole list.
  const [jobsList, setJobsList] = useState([]);

  const { workspacesEndpoint, workspacesToken } = useContext(AppContext);

  useEffect(() => {
    async function getAndSetJobsList() {
      const response = await fetch(`${workspacesEndpoint}/jobs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'UWS-Authorization': `Token ${workspacesToken}`,
        },
      });

      if (!response.ok) {
        console.error('Workspaces API failed', response);
        return;
      }
      const results = await response.json();

      setJobsList(results.data.jobs);
      // TODO:
      // setIsLoading(false);
    }
    getAndSetJobsList();
  }, [workspacesEndpoint, workspacesToken]);

  return { jobsList };
}

export { useJobsList, useWorkspaces };
