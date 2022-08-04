async function createNotebookWorkspace({
  workspacesEndpoint,
  workspacesToken,
  workspaceName,
  workspaceDescription,
  notebookContent,
}) {
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
    headers: {
      'Content-Type': 'application/json',
      'UWS-Authorization': `Token ${workspacesToken}`,
    },
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
    const { url_domain, url_path } = job.job_details.current_job_details.connection_details;
    return `${url_domain}${url_path}`;
  }

  const displayJobs = jobs.map((job) => {
    const diplayJob = { ...job };
    diplayJob.status = getDisplayStatus(job.status);
    return diplayJob;
  });

  const bestJob = [ACTIVE, ACTIVATING, INACTIVE]
    .map((status) => displayJobs.find((job) => job.status === status))
    .find((job) => job);

  if (!bestJob) {
    return null;
  }
  if (bestJob.status === ACTIVE) {
    return { status: ACTIVE, url: getJobUrl(bestJob) };
  }
  return { status: bestJob.status };
}

export { createNotebookWorkspace, startJob, mergeJobsIntoWorkspaces, condenseJobs };
