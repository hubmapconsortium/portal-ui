import React, { useState, useContext } from 'react';

import { AppContext } from 'js/components/Providers';
import { locationIfJobRunning } from 'js/components/workspaces/utils';

function WorkspacePleaseWait({ workspaceId }) {
  const [message, setMessage] = useState();
  const [dead, setDead] = useState();
  const { workspacesEndpoint, workspacesToken } = useContext(AppContext);

  async function setLocationOrRetry() {
    const jobLocation = await locationIfJobRunning({
      workspaceId,
      setMessage,
      setDead,
      workspacesEndpoint,
      workspacesToken,
    });
    if (jobLocation) {
      document.location = jobLocation;
    } else {
      setTimeout(setLocationOrRetry, 5000);
    }
  }

  if (!dead) {
    setLocationOrRetry();
  }

  return <>Please wait... {message}</>;
}

export default WorkspacePleaseWait;
