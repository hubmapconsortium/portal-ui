import React, { useContext, useState } from 'react';

import { AppContext } from 'js/components/Providers';

function WorkspacePleaseWait({ id }) {
  const { workspacesEndpoint, workspacesToken } = useContext(AppContext);

  const [status, setStatus] = useState();

  async function loadIfUp() {
    const response = await fetch(`${workspacesEndpoint}/jobs/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'UWS-Authorization': `Token ${workspacesToken}`,
      },
    });
    const responseJson = await response.json();
    const { current_job_details } = responseJson.data.jobs[0].job_details;
    setStatus(current_job_details.message);
    const { connection_details } = current_job_details;
    if (connection_details) {
      const { url_path, url_domain } = connection_details;
      document.location = `${url_domain}${url_path}`;
    }
  }

  setInterval(loadIfUp, 1000);

  return <>Please wait... {status}</>;
}

export default WorkspacePleaseWait;
