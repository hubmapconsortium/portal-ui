import React from 'react';

import { LightBlueLink } from 'js/shared-styles/Links';
import { condenseJobs } from './utils';

function JobDetails({ jobs }) {
  const job = condenseJobs(jobs);

  if (!job) {
    return null;
  }
  if (job.url) {
    return <LightBlueLink href={job.url}>Status: {job.status}</LightBlueLink>;
  }
  return `Status: ${job.status}`;
}

export default JobDetails;
