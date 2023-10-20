// Workspaces:

const workspaceStatuses = {
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

type WorkspaceStatus = keyof typeof workspaceStatuses;
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

const jobStatuses = {
  pending: {
    isDone: false,
  },
  running: {
    isDone: false,
  },
  stopping: {
    isDone: true,
  },
  complete: {
    isDone: true,
  },
  failed: {
    isDone: true,
  },
};

type JobStatus = keyof typeof jobStatuses;
const expectedJobStatuses = Object.keys(jobStatuses);

function isJobStatus(status: string): status is JobStatus {
  return expectedJobStatuses.includes(status);
}

function validateJobStatus(status: string): status is JobStatus {
  if (!isJobStatus(status)) {
    throw Error(`Unexpected job status "${status}"; expected one of (${expectedJobStatuses.toString()})`);
  }
  return true;
}

export { jobStatuses, validateJobStatus, workspaceStatuses, validateWorkspaceStatus };
