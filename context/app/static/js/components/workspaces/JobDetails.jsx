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

  const bestJob = [ACTIVE, ACTIVATING, INACTIVE]
    .map((status) => displayJobs.find((job) => job.status === status))
    .find((job) => job);

  if (!bestJob) {
    return null;
  }
  if (bestJob.status === ACTIVE) {
    return <LightBlueLink href={getJobUrl(bestJob)}>Status: {ACTIVE}</LightBlueLink>;
  }
  return `Status: ${bestJob.status}`;
}

export default JobDetails;
