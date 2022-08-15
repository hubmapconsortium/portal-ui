import React, { useContext, useState, useEffect } from 'react';

import { AppContext } from 'js/components/Providers';

function WorkspacePleaseWait({ id }) {
  const { workspacesEndpoint, workspacesToken } = useContext(AppContext);

  const [job, setJob] = useState();

  useEffect(() => {
    async function fetchJob() {
      const response = await fetch(`${workspacesEndpoint}/jobs/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'UWS-Authorization': `Token ${workspacesToken}`,
        },
      });
      const responseJson = await response.json();
      const { url_path, url_domain } = responseJson.data.jobs[0].job_details.current_job_details.connection_details;
      setJob(`${url_domain}${url_path}`);
    }
    fetchJob();
  }, [workspacesEndpoint, id, workspacesToken]);

  return (
    <>
      Please wait... <pre>{JSON.stringify(job, null, 2)}</pre>
    </>
  );
}

export default WorkspacePleaseWait;
