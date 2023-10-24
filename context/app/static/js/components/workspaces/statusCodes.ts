// Workspaces:

export type WorkspaceStatus = 'active' | 'idle' | 'deleting' | 'error';

const workspaceStatuses: Record<WorkspaceStatus, { isDone: boolean }> = {
  active: {
    isDone: false,
  },
  idle: {
    isDone: false,
  },
  deleting: {
    isDone: true,
  },
  error: {
    isDone: true,
  },
};

const expectedWorkspaceStatuses = Object.keys(workspaceStatuses);

function isWorkspaceStatus(status: string): status is WorkspaceStatus {
  return expectedWorkspaceStatuses.includes(status);
}

function validateWorkspaceStatus(status: string): status is WorkspaceStatus {
  if (!isWorkspaceStatus(status)) {
    throw Error(`Unexpected workspace status "${status}"; expected one of (${expectedWorkspaceStatuses.toString()})`);
  }
  return true;
}

// Jobs:

export type JobStatus = 'pending' | 'running' | 'stopping' | 'complete' | 'failed';
const ACTIVE = 'Active' as const;
const ACTIVATING = 'Activating' as const;
const INACTIVE = 'Inactive' as const;
export type JobStatusDisplayName = typeof ACTIVE | typeof ACTIVATING | typeof INACTIVE;

const JOB_DISPLAY_NAMES = [ACTIVE, ACTIVATING, INACTIVE];

const jobStatuses: Record<JobStatus, { isDone: boolean; displayName: JobStatusDisplayName }> = {
  pending: {
    isDone: false,
    displayName: ACTIVATING,
  },
  running: {
    isDone: false,
    displayName: ACTIVE,
  },
  stopping: {
    isDone: true,
    displayName: INACTIVE,
  },
  complete: {
    isDone: true,
    displayName: INACTIVE,
  },
  failed: {
    isDone: true,
    displayName: INACTIVE,
  },
};

const expectedJobStatuses = Object.keys(jobStatuses);

function isJobStatus(status: string): status is JobStatus {
  console.log(expectedJobStatuses, status);
  return expectedJobStatuses.includes(status);
}

function validateJobStatus(status: string): status is JobStatus {
  if (!isJobStatus(status)) {
    throw Error(`Unexpected job status "${status}"; expected one of (${expectedJobStatuses.toString()})`);
  }
  return true;
}

function getJobStatusDisplayName(status: JobStatus) {
  validateJobStatus(status);
  return jobStatuses[status].displayName;
}

function getJobStatusIsDone(status: JobStatus) {
  return jobStatuses[status].isDone;
}

export {
  jobStatuses,
  validateJobStatus,
  workspaceStatuses,
  validateWorkspaceStatus,
  isWorkspaceStatus,
  isJobStatus,
  getJobStatusIsDone,
  getJobStatusDisplayName,
  ACTIVE,
  ACTIVATING,
  INACTIVE,
  JOB_DISPLAY_NAMES,
};
