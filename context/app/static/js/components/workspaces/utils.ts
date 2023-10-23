import {
  jobStatuses,
  validateJobStatus,
  workspaceStatuses,
  validateWorkspaceStatus,
  isWorkspaceStatus,
  getJobStatusDisplayName,
  JOB_DISPLAY_NAMES,
  ACTIVE,
  ACTIVATING,
  INACTIVE,
  JobStatusDisplayName,
} from './statusCodes';

import type { MergedWorkspace, Workspace, WorkspaceAPIResponse, WorkspaceJob } from './types';

function getWorkspacesApiHeaders(workspacesToken: string) {
  return {
    'Content-Type': 'application/json',
    'UWS-Authorization': `Token ${workspacesToken}`,
  };
}

interface WorkspaceActionArgs {
  workspaceId: number;
  workspacesEndpoint: string;
  workspacesToken: string;
}

async function startJob({ workspaceId, workspacesEndpoint, workspacesToken }: WorkspaceActionArgs) {
  const response = fetch(`${workspacesEndpoint}/job_types`);
  const { data, success } = (await (await response).json()) as WorkspaceAPIResponse<{
    job_types: Record<string, { id: number }>;
  }>;
  if (!success) {
    console.error('Failed to get job types', response);
    return;
  }
  const result = fetch(`${workspacesEndpoint}/workspaces/${workspaceId}/start`, {
    method: 'PUT',
    headers: getWorkspacesApiHeaders(workspacesToken),
    body: JSON.stringify({
      job_type: data.job_types.jupyter_lab.id,
      job_details: {},
    }),
  });
  if (!(await result).ok) {
    console.error('Failed to start job', result);
  }
}

interface CreateWorkspaceAndNotebookArgs {
  path: string;
  body: unknown;
}

interface CreateWorkspaceAndNotebookResponse {
  workspace_id: number;
  notebook_path: string;
}

async function createWorkspaceAndNotebook({ path, body }: CreateWorkspaceAndNotebookArgs) {
  const response = await fetch(`/notebooks/${path}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    console.error('Create workspace failed', response);
  }
  const { workspace_id, notebook_path } = (await response.json()) as CreateWorkspaceAndNotebookResponse;
  return { workspace_id, notebook_path };
}

interface StopJobArgs {
  jobId: number;
  workspacesEndpoint: string;
  workspacesToken: string;
}

async function stopJob({ jobId, workspacesEndpoint, workspacesToken }: StopJobArgs) {
  return fetch(`${workspacesEndpoint}/jobs/${jobId}/stop/`, {
    method: 'PUT',
    headers: getWorkspacesApiHeaders(workspacesToken),
  }).catch(() => console.error(`Job stop for job #${jobId} failed`));
}

async function deleteWorkspace({ workspaceId, workspacesEndpoint, workspacesToken }: WorkspaceActionArgs) {
  const headers = getWorkspacesApiHeaders(workspacesToken);
  const response = await fetch(`${workspacesEndpoint}/workspaces/${workspaceId}/`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) {
    throw Error(`Workspace deletion for workspace #${workspaceId} failed`);
  }
}

async function stopJobs({ workspaceId, workspacesEndpoint, workspacesToken }: WorkspaceActionArgs) {
  const headers = getWorkspacesApiHeaders(workspacesToken);
  const jobsResponse = await fetch(`${workspacesEndpoint}/jobs`, { headers });
  const jobsResults = (await jobsResponse.json()) as WorkspaceAPIResponse<{ jobs: WorkspaceJob[] }>;
  if (!jobsResults.success) {
    throw new Error(jobsResults.message);
  }
  const { jobs } = jobsResults.data;

  const activeWorkspaceJobs = jobs.filter(
    (job) => String(job.workspace_id) === String(workspaceId) && ['running', 'pending'].includes(job.status),
  );

  await Promise.all(
    activeWorkspaceJobs.map((job) => {
      return stopJob({ jobId: job.id, workspacesEndpoint, workspacesToken });
    }),
  );
}

function getNotebookPath(workspace: Workspace) {
  const { files } = workspace.workspace_details.current_workspace_details;
  return (files || []).find(({ name }) => name.endsWith('.ipynb'))?.name ?? '';
}

function mergeJobsIntoWorkspaces(jobs: WorkspaceJob[], workspaces: Workspace[]): MergedWorkspace[] {
  workspaces.forEach((ws) => {
    validateWorkspaceStatus(ws.status);
  });
  const activeWorkspaces = workspaces.filter(
    ({ status }) => isWorkspaceStatus(status) && !workspaceStatuses[status].isDone,
  );

  const wsIdToJobs: Record<number, WorkspaceJob[]> = {};
  jobs.forEach((job) => {
    const { status, workspace_id } = job;
    validateJobStatus(status);
    if (jobStatuses[status].isDone) {
      return;
    }
    if (!(workspace_id in wsIdToJobs)) {
      wsIdToJobs[workspace_id] = [];
    }
    wsIdToJobs[workspace_id].push(job);
  });

  const mergedWorkspaces: MergedWorkspace[] = activeWorkspaces.map((workspace) => ({
    ...workspace,
    jobs: wsIdToJobs?.[workspace.id] || [],
    path: getNotebookPath(workspace),
  }));

  return mergedWorkspaces;
}

type JobDetails = Pick<WorkspaceJob, 'job_details'>;

function getJobUrl(job: JobDetails) {
  const details = job.job_details.current_job_details;
  if (details.connection_details) {
    const { url_domain, url_path } = details.connection_details;
    return `${url_domain}${url_path}`;
  }
  return undefined;
}

function getJobMessage(job: JobDetails) {
  const details = job.job_details.current_job_details;
  return details.message;
}

interface CondensedJob {
  status?: JobStatusDisplayName;
  allowNew: boolean;
  url?: string;
  message?: string;
}

function condenseJobs(jobs: WorkspaceJob[]): CondensedJob {
  const displayStatusJobs = jobs.map((job) => ({
    ...job,
    status: getJobStatusDisplayName(job.status),
  }));

  const bestJob = JOB_DISPLAY_NAMES.map((status) => displayStatusJobs.find((job) => job.status === status)).find(
    (job) => job,
  ); // Trivial .find() to just take the job with highest status.

  const status = bestJob?.status;
  switch (status) {
    case ACTIVE:
      if (!bestJob) {
        throw Error(`Unexpectedly missing job with status ${ACTIVE}`);
      }
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

interface GetWorkspaceJobArgs extends WorkspaceActionArgs {
  setMessage: (message?: string) => void;
  setDead: (dead: boolean) => void;
}

async function getWorkspaceJob({
  workspaceId,
  setMessage,
  setDead,
  workspacesEndpoint,
  workspacesToken,
}: GetWorkspaceJobArgs) {
  const jobsResponse = await fetch(`${workspacesEndpoint}/jobs`, {
    method: 'GET',
    headers: getWorkspacesApiHeaders(workspacesToken),
  });

  if (!jobsResponse.ok) {
    setDead(true);
    setMessage('API Error; Are you logged in?');
    return null;
  }

  const result = (await jobsResponse.json()) as WorkspaceAPIResponse<{ jobs: WorkspaceJob[] }>;
  if (!result.success) {
    setDead(true);
    setMessage(result.message);
    return null;
  }
  const { jobs } = result.data;
  const jobsForWorkspace = jobs.filter((job) => String(job.workspace_id) === String(workspaceId));
  const job = condenseJobs(jobsForWorkspace);
  setMessage(job?.message);
  return job;
}

async function locationIfJobRunning({
  workspaceId,
  setMessage,
  setDead,
  workspacesEndpoint,
  workspacesToken,
}: GetWorkspaceJobArgs) {
  const job = await getWorkspaceJob({ workspaceId, setMessage, setDead, workspacesEndpoint, workspacesToken });

  if (job?.url) {
    return job.url;
  }

  return null;
}

function getWorkspaceLink(workspace: Workspace) {
  return `/workspaces/${workspace.id}?notebook_path=${encodeURIComponent(workspace.path)}`;
}

export {
  createWorkspaceAndNotebook,
  deleteWorkspace,
  stopJobs,
  mergeJobsIntoWorkspaces,
  condenseJobs,
  locationIfJobRunning,
  startJob,
  getWorkspaceLink,
};
