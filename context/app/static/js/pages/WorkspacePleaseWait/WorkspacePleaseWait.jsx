import React, { useState, useContext } from 'react';
import Typography from '@material-ui/core/Typography';

import { AppContext } from 'js/components/Providers';
import { locationIfJobRunning } from 'js/components/workspaces/utils';
import WorkspacesTitle from 'js/components/workspaces/WorkspacesTitle';

function WorkspacePleaseWait({ workspaceId }) {
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
    } else {
      setTimeout(setLocationOrRetry, 5000);
    }
  }

  setLocationOrRetry();

  return (
    <>
      <WorkspacesTitle />
      <Typography>Please wait... {message}</Typography>
    </>
  );
}

export default WorkspacePleaseWait;
