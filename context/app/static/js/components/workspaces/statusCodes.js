// Workspaces:

const workspaceStatus = {
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

function validateWorkspaceStatus(status) {
  const expected = Object.keys(workspaceStatus);
  if (!expected.includes(status)) {
    throw Error(`Unexpected workspace status "${status}"; expected one of (${expected})`);
  }
}

// Jobs:

const jobStatus = {
  pending: {
    isDone: false,
  },
  running: {
    isDone: false,
  },
  complete: {
    isDone: true,
  },
  failed: {
    isDone: true,
  },
};

function validateJobStatus(status) {
  const expected = Object.keys(jobStatus);
  if (!expected.includes(status)) {
    throw Error(`Unexpected job status "${status}"; expected one of (${expected})`);
  }
}

export { jobStatus, validateJobStatus, workspaceStatus, validateWorkspaceStatus };
