import { useState, useRef } from 'react';

import { useAppContext } from 'js/components/Contexts';
import { getWorkspaceJob } from 'js/components/workspaces/utils';
import useInterval from 'js/hooks/useInterval';
import { trackMeasurement } from 'js/helpers/trackers';
import { useWorkspacesList } from 'js/components/workspaces/hooks';

const ACTIVATING_STATUS = 'Activating';

function useWorkspacesPleaseWait(workspaceId) {
  const [message, setMessage] = useState();
  const [dead, setDead] = useState();
  const { workspacesEndpoint, workspacesToken } = useAppContext();
  const loadingStartTime = useRef(new Date().getTime());
  const firstRunningResponseTime = useRef();
  const [jobStatus, setJobStatus] = useState();
  const { handleStopWorkspace } = useWorkspacesList();

  async function setLocationOrRetry() {
    if (dead) {
      return;
    }
    const jobLocation = await getWorkspaceJob({
      workspaceId,
      setMessage,
      setDead,
      workspacesEndpoint,
      workspacesToken,
    });

    if (!jobLocation) {
      return;
    }
    const { status } = jobLocation;
    setJobStatus(status);
    if (jobLocation.status === 'Active') {
      // Track first time we see the job is running to measure time job is pending and jupyter startup time
      if (!firstRunningResponseTime.current) {
        firstRunningResponseTime.current = new Date().getTime();
      }
      // If no URL is present yet, jupyter env is still starting up
      if (!jobLocation.url) {
        return;
      }
      const loadingEndTime = new Date().getTime();
      const resourceAllocationDuration = firstRunningResponseTime.current - loadingStartTime.current;
      const jupyterStartupDuration = loadingEndTime - firstRunningResponseTime.current;
      const loadingDuration = loadingEndTime - loadingStartTime.current;
      trackMeasurement(
        'workspace_loading',
        {
          resourceAllocationDuration,
          jupyterStartupDuration,
          loadingDuration,
        },
        { workspaceId, jobUrl: jobLocation.url },
      );
      const [urlBase, urlQuery] = jobLocation.url.split('?');
      const workspacePath = new URLSearchParams(document.location.search).get('notebook_path');
      const jupyterUrl = `${urlBase}/tree/${workspacePath}?${urlQuery}`;
      document.location = jupyterUrl;
    }

    if (status === ACTIVATING_STATUS && new Date().getTime() - loadingStartTime.current > 5 * 60 * 1000) {
      try {
        await handleStopWorkspace(workspaceId);
        document.location = `/workspaces/?failed_workspace_id=${encodeURIComponent(workspaceId)}`;
      } catch (e) {
        console.error(e);
      }
    }
  }

  useInterval(setLocationOrRetry, 1000);

  return {
    message,
    isPending30s: jobStatus === ACTIVATING_STATUS && new Date().getTime() - loadingStartTime.current > 30 * 1000,
  };
}

export default useWorkspacesPleaseWait;
