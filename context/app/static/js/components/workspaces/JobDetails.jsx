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

  const firstActiveJob = displayJobs.find((job) => job.status === ACTIVE);
  if (firstActiveJob) {
    return <LightBlueLink href={getJobUrl(firstActiveJob)}>Status: {firstActiveJob.status}</LightBlueLink>;
  }

  const firstActivatingJob = displayJobs.find((job) => job.status === ACTIVATING);
  if (firstActivatingJob) {
    return `Status: ${firstActivatingJob.status}`;
  }

  const firstInactiveJob = displayJobs.find((job) => job.status === INACTIVE);
  if (firstInactiveJob) {
    return `Status: ${firstInactiveJob.status}`;
  }
  return '';
}

export default JobDetails;
