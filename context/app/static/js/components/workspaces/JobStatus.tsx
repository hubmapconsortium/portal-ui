function JobStatus({ job }: { job: { status?: string } }) {
  return `Status: ${job.status || 'No Jobs'}`;
}

export default JobStatus;
