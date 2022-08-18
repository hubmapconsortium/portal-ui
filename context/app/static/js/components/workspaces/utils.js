async function createEmptyWorkspace({ workspacesEndpoint, workspacesToken, workspaceName, workspaceDescription }) {
  await fetch(`${workspacesEndpoint}/workspaces`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'UWS-Authorization': `Token ${workspacesToken}`,
    },
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
  const headers = {
    'Content-Type': 'application/json',
    'UWS-Authorization': `Token ${workspacesToken}`,
  };
  await fetch(`${workspacesEndpoint}/jobs/${jobId}/stop/`, { method: 'PUT', headers });
}

async function deleteWorkspace({ workspaceId, workspacesEndpoint, workspacesToken }) {
  const headers = {
    'Content-Type': 'application/json',
    'UWS-Authorization': `Token ${workspacesToken}`,
  };
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

async function startJob({ workspaceId, workspacesEndpoint, workspacesToken }) {
  const response = await fetch(`${workspacesEndpoint}/workspaces/${workspaceId}/start`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'UWS-Authorization': `Token ${workspacesToken}`,
    },
    body: JSON.stringify({
      job_type: 'JupyterLabJob',
      job_details: {},
    }),
  });
  const responseJson = await response.json();
  window.open(`/workspaces/jobs/${responseJson.data.job.id}`, '_blank');
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
    // TODO
    return `/poll-job-${job.id}-until-ready`;
  }

  const displayStatusJobs = jobs.map((job) => ({ ...job, status: getDisplayStatus(job.status) }));

  const bestJob = [ACTIVE, ACTIVATING, INACTIVE]
    .map((status) => displayStatusJobs.find((job) => job.status === status))
    .find((job) => job);

  const status = bestJob?.status;
  switch (status) {
    case ACTIVE:
      return { status, allowNew: false, url: getJobUrl(bestJob) };
    case ACTIVATING:
      return { status, allowNew: false };
    case INACTIVE:
      return { status, allowNew: true };
    default:
      // No jobs of any status.
      return { status, allowNew: true };
  }
}

export { createEmptyWorkspace, deleteWorkspace, startJob, mergeJobsIntoWorkspaces, condenseJobs };
