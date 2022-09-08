function getWorkspacesApiHeaders(workspacesToken) {
  return {
    'Content-Type': 'application/json',
    'UWS-Authorization': `Token ${workspacesToken}`,
  };
}

async function createEmptyWorkspace({ workspacesEndpoint, workspacesToken, workspaceName, workspaceDescription }) {
  await fetch(`${workspacesEndpoint}/workspaces`, {
    method: 'POST',
    headers: getWorkspacesApiHeaders(workspacesToken),
    body: JSON.stringify({
      name: workspaceName,
      description: workspaceDescription,
      workspace_details: {
        symlinks: [],
        files: [],
      },
    }),
  });
}

async function stopJob({ jobId, workspacesEndpoint, workspacesToken }) {
  await fetch(`${workspacesEndpoint}/jobs/${jobId}/stop/`, {
    method: 'PUT',
    headers: getWorkspacesApiHeaders(workspacesToken),
  });
}

async function deleteWorkspace({ workspaceId, workspacesEndpoint, workspacesToken }) {
  const headers = getWorkspacesApiHeaders(workspacesToken);
  const jobsResponse = await fetch(`${workspacesEndpoint}/jobs`, { headers });
  const jobsResults = await jobsResponse.json();
  const { jobs } = jobsResults.data;
  jobs.forEach((job) => {
    if (String(job.workspace_id) === workspaceId) {
      stopJob({ jobId: job.id, workspacesEndpoint, workspacesToken });
    }
  });
  async function retryDelete() {
    const deleteResponse = await fetch(`${workspacesEndpoint}/workspaces/${workspaceId}/`, {
      method: 'DELETE',
      headers,
    });
    // Delete will fail until all jobs are stopped, and this is simpler than checking all the jobs.
    if (!deleteResponse.ok) {
      setTimeout(retryDelete, 5000);
    }
  }
  retryDelete();
}

async function startJob({ workspaceId, workspacesEndpoint, workspacesToken, setMessage, setDead }) {
  const startResponse = await fetch(`${workspacesEndpoint}/workspaces/${workspaceId}/start`, {
    method: 'PUT',
    headers: getWorkspacesApiHeaders(workspacesToken),
    body: JSON.stringify({
      job_type: 'JupyterLabJob',
      job_details: {},
    }),
  });

  if (!startResponse.ok) {
    setDead(true);
  }
  const start = await startResponse.json();
  setMessage(start.message);
}

function getNotebookPath(workspace) {
  const { files } = workspace.workspace_details.current_workspace_details;
  const nbFiles = files.filter(({ name }) => name.endsWith('.ipynb'));
  if (nbFiles.length !== 1) {
    return '';
  }
  return nbFiles[0].name;
}

function mergeJobsIntoWorkspaces(jobs, workspaces) {
  const activeWorkspaces = workspaces.filter(({ status }) => ['active', 'idle'].includes(status));

  const wsIdToJobs = {};
  jobs.forEach((job) => {
    const { workspace_id } = job;
    if (!(workspace_id in wsIdToJobs)) {
      wsIdToJobs[workspace_id] = [];
    }
    wsIdToJobs[workspace_id].push(job);
  });

  activeWorkspaces.forEach((workspace) => {
    // eslint-disable-next-line no-param-reassign
    workspace.jobs = wsIdToJobs?.[workspace.id] || [];
    // eslint-disable-next-line no-param-reassign
    workspace.path = getNotebookPath(workspace);
  });

  return activeWorkspaces;
}

function condenseJobs(jobs) {
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
    const details = job.job_details.current_job_details;
    if (details.connection_details) {
      const { url_domain, url_path } = details.connection_details;
      return `${url_domain}${url_path}`;
    }
    return null;
  }

  function getJobMessage(job) {
    const details = job.job_details.current_job_details;
    return details.message;
  }

  const displayStatusJobs = jobs.map((job) => ({
    ...job,
    status: getDisplayStatus(job.status),
  }));

  const bestJob = [ACTIVE, ACTIVATING, INACTIVE]
    .map((status) => displayStatusJobs.find((job) => job.status === status))
    .find((job) => job); // Trivial .find() to just take the job with highest status.

  const status = bestJob?.status;
  switch (status) {
    case ACTIVE:
      return { status, allowNew: false, url: getJobUrl(bestJob), message: getJobMessage(bestJob) };
    case ACTIVATING:
      return { status, allowNew: false, message: ACTIVATING };
    case INACTIVE:
      return { status, allowNew: true };
    default:
      // No jobs of any status.
      return { status, allowNew: true };
  }
}

async function locationIfJobRunning({ workspaceId, setMessage, setDead, workspacesEndpoint, workspacesToken }) {
  const jobsResponse = await fetch(`${workspacesEndpoint}/jobs`, {
    method: 'GET',
    headers: getWorkspacesApiHeaders(workspacesToken),
  });
  if (!jobsResponse.ok) {
    setDead(true);
    setMessage('API Error; Are you logged in?');
    return null;
  }

  const jobsResults = await jobsResponse.json();
  const { jobs } = jobsResults.data;
  const jobsForWorkspace = jobs.filter((job) => String(job.workspace_id) === workspaceId);
  const job = condenseJobs(jobsForWorkspace);
  setMessage(job.message);

  if (job.url) {
    return job.url;
  }
  if (job.allowNew) {
    await startJob({ workspaceId, workspacesEndpoint, workspacesToken, setMessage, setDead });
  }
  return null;
}

export { createEmptyWorkspace, deleteWorkspace, mergeJobsIntoWorkspaces, condenseJobs, locationIfJobRunning };
