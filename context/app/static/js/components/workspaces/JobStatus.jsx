function JobStatus({ job }) {
  if (!job.status) {
    return null;
  }
  return `Status: ${job.status}`;
}

export default JobStatus;
