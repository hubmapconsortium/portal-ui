import React from 'react';

function JobDetails(props) {
  const { job } = props;
  const { status, datetime_created } = job;
  const details = job.job_details.current_job_details;
  const { url_path, url_domain } = details.connection_details;
  return (
    <div key={job.id}>
      <a href={`${url_domain}${url_path}`}>
        Jupyter ({status}, {datetime_created})
      </a>
      <details>
        <summary>JSON</summary>
        <pre>{JSON.stringify(job, null, 2)}</pre>
      </details>
    </div>
  );
}

export default JobDetails;
