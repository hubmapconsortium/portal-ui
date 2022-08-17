function getApiHeaders(workspacesToken) {
  return {
    'Content-Type': 'application/json',
    'UWS-Authorization': `Token ${workspacesToken}`,
  };
}

async function createNotebookWorkspace({
  workspacesEndpoint,
  workspacesToken,
  workspaceName,
  workspaceDescription,
  notebookContent,
}) {
  await fetch(`${workspacesEndpoint}/workspaces`, {
    method: 'POST',
    headers: getApiHeaders(workspacesToken),
    body: JSON.stringify({
      name: workspaceName,
      description: workspaceDescription,
      workspace_details: {
        symlinks: [],
        files: [
          {
            name: 'notebook.ipynb',
            content: notebookContent,
          },
        ],
      },
    }),
  });
}

async function startJob({ workspaceId, workspacesEndpoint, workspacesToken }) {
  await fetch(`${workspacesEndpoint}/workspaces/${workspaceId}/start`, {
    method: 'PUT',
    headers: getApiHeaders(workspacesToken),
    body: JSON.stringify({
      job_type: 'JupyterLabJob',
      job_details: {},
    }),
  });
}

function mergeJobsIntoWorkspaces(jobs, workspaces) {
  const wsIdToJobs = {};
  jobs.forEach((job) => {
    const { workspace_id } = job;
    if (!(workspace_id in wsIdToJobs)) {
      wsIdToJobs[workspace_id] = [];
    }
    wsIdToJobs[workspace_id].push(job);
  });

  workspaces.forEach((workspace) => {
    // eslint-disable-next-line no-param-reassign
    workspace.jobs = wsIdToJobs?.[workspace.id] || [];
  });

  return workspaces;
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

async function locationIfJobRunning({ workspaceId, setMessage, workspacesEndpoint, workspacesToken }) {
  const jobsResponse = await fetch(`${workspacesEndpoint}/jobs`, {
    method: 'GET',
    headers: getApiHeaders(workspacesToken),
  });
  const jobsResults = await jobsResponse.json();
  const { jobs } = jobsResults.data;
  const jobsForWorkspace = jobs.filter((job) => String(job.workspace_id) === workspaceId);
  const job = condenseJobs(jobsForWorkspace);
  setMessage(job.message);
  if (job.url) {
    return job.url;
  }
  if (job.allowNew) {
    await startJob({ workspaceId, workspacesEndpoint, workspacesToken });
  }
  return null;
}

export { createNotebookWorkspace, startJob, mergeJobsIntoWorkspaces, condenseJobs, locationIfJobRunning };
