function JobStatus({ job }) {
  return `Status: ${job.status || 'No Jobs'}`;
}

export default JobStatus;
