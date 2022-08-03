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
  const status = mapStatus(job.status);
  const { url_domain, url_path } = job.job_details.current_job_details.connection_details;

  return <LightBlueLink href={`${url_domain}${url_path}`}>Status: {status}</LightBlueLink>;
}

export default JobDetails;
