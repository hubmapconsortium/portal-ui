import { useState } from 'react';

import { useAppContext } from 'js/components/Contexts';
import { getWorkspaceJob } from 'js/components/workspaces/utils';
import useInterval from 'js/hooks/useInterval';
import { useWorkspacesList } from 'js/components/workspaces/hooks';

const ACTIVATING_STATUS = 'Activating';

function useWorkspacesPleaseWait(workspaceId: number) {
  const [message, setMessage] = useState<string | undefined>();
  const [dead, setDead] = useState<boolean | undefined>();
  const { workspacesEndpoint, workspacesToken } = useAppContext();
  const [loadingStartTime] = useState(() => new Date().getTime());
  const [jobStatus, setJobStatus] = useState<string | undefined>();
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

    if (status === ACTIVATING_STATUS && new Date().getTime() - loadingStartTime > 5 * 60 * 1000) {
      try {
        await handleStopWorkspace(workspaceId);
        document.location.href = `/workspaces/?failed_workspace_id=${encodeURIComponent(workspaceId)}`;
      } catch (e) {
        console.error(e);
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
