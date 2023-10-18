import { useState, useRef } from 'react';

import { useAppContext } from 'js/components/Contexts';
import { locationIfJobRunning } from 'js/components/workspaces/utils';
import useInterval from 'js/hooks/useInterval';
import { trackEvent } from 'js/helpers/trackers';

function useWorkspacesPleaseWait(workspaceId) {
  const [message, setMessage] = useState();
  const [dead, setDead] = useState();
  const { workspacesEndpoint, workspacesToken } = useAppContext();
  const loadingStartTime = useRef(new Date().getTime());

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
      const loadingEndTime = new Date().getTime();
      const loadingDuration = loadingEndTime - loadingStartTime.current;
      trackEvent({
        category: 'Workspace Loading',
        value: loadingDuration,
      });
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
