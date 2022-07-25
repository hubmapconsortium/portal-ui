import React from 'react';

import { LightBlueLink } from 'js/shared-styles/Links';

function JobDetails({ job }) {
  const { status, datetime_created } = job;
  const details = job.job_details.current_job_details.connection_details;
  // I would destructure details...
  // except that in some cases connection_details has been missing.
  return (
    <div key={job.id}>
      {details ? (
        <LightBlueLink href={`${details.url_domain}${details.url_path}`}>
          Jupyter ({status}, {datetime_created})
        </LightBlueLink>
      ) : (
        'Jupyter not available'
      )}
      <details>
        <summary>JSON</summary>
        <pre>{JSON.stringify(job, null, 2)}</pre>
      </details>
    </div>
  );
}

export default JobDetails;
