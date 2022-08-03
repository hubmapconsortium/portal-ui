import React from 'react';

import { LightBlueLink } from 'js/shared-styles/Links';

function mapStatus(status) {
  return (
    {
      pending: 'Activating',
      running: 'Active',
    }[status] || 'Inactive'
  );
}

function JobDetails({ job }) {
  const { status, datetime_created } = job;
  const details = job.job_details.current_job_details.connection_details;
  // I would destructure details...
  // except that in some cases connection_details has been missing.
  return (
    <div>
      {details ? (
        <LightBlueLink href={`${details.url_domain}${details.url_path}`}>
          Jupyter ({mapStatus(status)}, {datetime_created})
        </LightBlueLink>
      ) : (
        'Jupyter not available'
      )}
    </div>
  );
}

export default JobDetails;
