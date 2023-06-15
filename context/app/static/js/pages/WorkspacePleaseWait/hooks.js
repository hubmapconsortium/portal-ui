import { useState, useContext } from 'react';

import { AppContext } from 'js/components/Providers';
import { locationIfJobRunning } from 'js/components/workspaces/utils';
import useInterval from 'js/hooks/useInterval';

function useWorkspacesPleaseWait(workspaceId) {
  const [message, setMessage] = useState();
  const [dead, setDead] = useState();
  const { workspacesEndpoint, workspacesToken } = useContext(AppContext);

  async function setLocationOrRetry() {
    if (dead) {
      return;
    }
    const jobLocation = await locationIfJobRunning({
      workspaceId,
      setMessage,
      setDead,
      workspacesEndpoint,
      workspacesToken,
    });
    if (jobLocation) {
      const [urlBase, urlQuery] = jobLocation.split('?');
      const workspacePath = new URLSearchParams(document.location.search).get('notebook_path');
      const jupyterUrl = `${urlBase}/tree/${workspacePath}?${urlQuery}`;
      document.location = jupyterUrl;
    }
  }

  useInterval(setLocationOrRetry, 5000);

  return { message };
}

export default useWorkspacesPleaseWait;
