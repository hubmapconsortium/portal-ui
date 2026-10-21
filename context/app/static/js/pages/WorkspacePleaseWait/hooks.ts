import { useRef, useState } from 'react';

import { useAppContext } from 'js/components/Contexts';
import { getWorkspaceJob } from 'js/components/workspaces/utils';
import useInterval from 'js/hooks/useInterval';
import { useWorkspacesList } from 'js/components/workspaces/hooks';

const ACTIVATING_STATUS = 'Activating';
// A just-started job can take a few polls to show up in /jobs; after this, a missing or inactive
// job means the start failed and polling would never end.
const NOT_STARTED_TIMEOUT_MS = 30 * 1000;

function useWorkspacesPleaseWait(workspaceId: number) {
  const [message, setMessage] = useState<string | undefined>();
  const [dead, setDead] = useState<boolean | undefined>();
  const { workspacesEndpoint, workspacesToken } = useAppContext();
  const [loadingStartTime] = useState(() => new Date().getTime());
  const [jobStatus, setJobStatus] = useState<string | undefined>();
  const { handleStopWorkspace } = useWorkspacesList();
  // The interval fires every second whether or not the last poll has finished.
  const isPolling = useRef(false);

  async function setLocationOrRetry() {
    if (dead || isPolling.current) {
      return;
    }
    isPolling.current = true;
    try {
      await pollJob();
    } finally {
      isPolling.current = false;
    }
  }

  async function pollJob() {
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
      // If no URL is present yet, jupyter env is still starting up
      if (!jobLocation.url) {
        return;
      }

      const currentURLParams = new URLSearchParams(window.location.search);
      const directJobType = currentURLParams.get('direct');

      if (directJobType) {
        document.location.href = jobLocation.url;
        return;
      }
      const [urlBase, urlQuery] = jobLocation.url.split('?');

      const workspacePath = currentURLParams.get('notebook_path');
      const jupyterUrl = urlQuery ? `${urlBase}/tree/${workspacePath}?${urlQuery}` : `${urlBase}/tree/${workspacePath}`;

      document.location.href = jupyterUrl;
    }

    const elapsed = new Date().getTime() - loadingStartTime;

    if (status !== 'Active' && status !== ACTIVATING_STATUS && elapsed > NOT_STARTED_TIMEOUT_MS) {
      setDead(true);
      setMessage('This workspace did not start. Return to your workspaces and launch it again.');
      return;
    }

    if (status === ACTIVATING_STATUS && elapsed > 5 * 60 * 1000) {
      // Stop polling first, so the stop request goes out once.
      setDead(true);
      try {
        await handleStopWorkspace(workspaceId);
        document.location.href = `/workspaces/?failed_workspace_id=${encodeURIComponent(workspaceId)}`;
      } catch (e) {
        console.error(e);
        setMessage('This workspace took too long to start and could not be stopped. Stop it from your workspaces.');
      }
    }
  }

  useInterval(setLocationOrRetry, 1000);

  return {
    message,
    isPending30s: jobStatus === ACTIVATING_STATUS && new Date().getTime() - loadingStartTime > 30 * 1000,
  };
}

export default useWorkspacesPleaseWait;
