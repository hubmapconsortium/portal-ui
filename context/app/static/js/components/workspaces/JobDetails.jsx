import React from 'react';

import { LightBlueLink } from 'js/shared-styles/Links';

function JobDetails({ job }) {
  const { status, datetime_created } = job;
  const details = job.job_details.current_job_details;
  const { url_path, url_domain } = details.connection_details;
  return (
    <div key={job.id}>
      <LightBlueLink href={`${url_domain}${url_path}`}>
        Jupyter ({status}, {datetime_created})
      </LightBlueLink>
      <details>
        <summary>JSON</summary>
        <pre>{JSON.stringify(job, null, 2)}</pre>
      </details>
    </div>
  );
}

export default JobDetails;
