import React, { useState, useContext } from 'react';

import { AppContext } from 'js/components/Providers';
import { locationIfJobRunning } from 'js/components/workspaces/utils';

function WorkspacePleaseWait({ workspaceId }) {
  const [status, setStatus] = useState();
  const { workspacesEndpoint, workspacesToken } = useContext(AppContext);

  async function setLocationOrRetry() {
    const jobLocation = await locationIfJobRunning({ workspaceId, setStatus, workspacesEndpoint, workspacesToken });
    if (jobLocation) {
      document.location = jobLocation;
    } else {
      setTimeout(setLocationOrRetry, 5000);
    }
  }

  setLocationOrRetry();

  return <>Please wait... {status}</>;
}

export default WorkspacePleaseWait;
