import React from 'react';

import { LightBlueLink } from 'js/shared-styles/Links';

const ACTIVE = 'Active';
const ACTIVATING = 'Activating';
const INACTIVE = 'Inactive';

function getDisplayStatus(status) {
  return (
    {
      pending: ACTIVATING,
      running: ACTIVE,
    }[status] || INACTIVE
  );
}

function getJobUrl(job) {
  const { url_domain, url_path } = job.job_details.current_job_details.connection_details;
  return `${url_domain}${url_path}`;
}

function JobDetails({ jobs }) {
  const displayJobs = jobs.map((job) => {
    const diplayJob = { ...job };
    diplayJob.status = getDisplayStatus(job.status);
    return diplayJob;
  });

  const firstActiveJob = displayJobs.filter((job) => job.status === ACTIVE)[0];
  const firstActivatingJob = displayJobs.filter((job) => job.status === ACTIVATING)[0];
  const firstInactiveJob = displayJobs.filter((job) => job.status === INACTIVE)[0];

  if (firstActiveJob) {
    return <LightBlueLink href={getJobUrl(firstActiveJob)}>Status: {firstActiveJob.status}</LightBlueLink>;
  }
  if (firstActivatingJob) {
    return `Status: ${firstActivatingJob.status}`;
  }
  if (firstInactiveJob) {
    return `Status: ${firstInactiveJob.status}`;
  }
  return '';
}

export default JobDetails;
