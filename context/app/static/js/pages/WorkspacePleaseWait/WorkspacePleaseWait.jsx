import React, { useState, useContext } from 'react';

import { AppContext } from 'js/components/Providers';
import { locationIfJobRunning } from 'js/components/workspaces/utils';

function WorkspacePleaseWait({ workspaceId }) {
  const [status, setStatus] = useState();
  const { workspacesEndpoint, workspacesToken } = useContext(AppContext);

  setTimeout(async () => {
    const jobLocation = await locationIfJobRunning({ workspaceId, setStatus, workspacesEndpoint, workspacesToken });
    if (jobLocation) {
      document.location = jobLocation;
    }
  }, 1000);

  setTimeout(async () => {
    const jobLocation = await locationIfJobRunning({ workspaceId, setStatus, workspacesEndpoint, workspacesToken });
    if (jobLocation) {
      document.location = jobLocation;
    }
  }, 10000);

  return <>Please wait... {status}</>;
}

export default WorkspacePleaseWait;
