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

interface WorkspaceActionArgs {
  workspaceId: number;
  workspacesEndpoint: string;
  workspacesToken: string;
}

interface CondensedJob {
  status?: JobStatusDisplayName;
  allowNew: boolean;
  url?: string;
  message?: string;
}

interface GetWorkspaceJobArgs extends WorkspaceActionArgs {
  setMessage: (message?: string) => void;
  setDead: (dead: boolean) => void;
}

/**
 * Creates the headers for a workspace request
 * @param workspacesToken The user's workspaces API token
 * @returns formatted headers for a workspace request
 */
function getWorkspaceHeaders(workspacesToken: string) {
  return {
    'Content-Type': 'application/json',
    'UWS-Authorization': `Token ${workspacesToken}`,
  };
}

/**
 * Gets the path of the notebook for a workspace
 * @param workspace The workspace to get the notebook path for
 * @returns The path of the notebook for the workspace
 */
function getNotebookPath(workspace: Workspace) {
  const { files } = workspace.workspace_details.current_workspace_details;
  return (files || []).find(({ name }) => name.endsWith('.ipynb'))?.name ?? '';
}

/**
 * Assigns jobs to workspaces based on workspace_id
 * @param jobs The list of jobs to assign
 * @param workspaces The list of workspaces to assign
 * @returns The list of workspaces with its `jobs` and `path` fields populated
 */
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

/**
 * Extracts the URL corresponding to a job
 * @param job The job to extract the URL from
 * @returns The URL to redirect the user to, if it exists
 */
function getJobUrl(job: JobDetails): string | undefined {
  const details = job.job_details.current_job_details;
  if (details.connection_details) {
    const { url_domain, url_path } = details.connection_details;
    return `${url_domain}${url_path}`;
  }
  return undefined;
}

/**
 * Extracts the message corresponding to a job
 * @param job The job to extract the message from
 * @returns The message to display to the user, if it exists
 */
function getJobMessage(job: JobDetails): string {
  const details = job.job_details.current_job_details;
  return details.message;
}

/**
 * Finds the best job to use for a workspace based on its status
 * @param jobs A list of jobs to extract the best job from
 * @returns A digest of the best job to use for a workspace which includes the status, whether a new job can be created, and the URL and message if the job is active/activating
 */
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
      // This case should never happen, but we'll handle it anyway for TypeScript completeness.
      if (!bestJob) {
        throw Error(`Unexpectedly missing job with status ${ACTIVE}`);
      }
      return { status, allowNew: false, url: getJobUrl(bestJob), message: getJobMessage(bestJob) };
    case ACTIVATING:
      return { status, allowNew: false, message: ACTIVATING };
    case INACTIVE:
      return { status, allowNew: true };
    case undefined:
    default:
      // No jobs of any status.
      return { status, allowNew: true };
  }
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
    headers: getWorkspaceHeaders(workspacesToken),
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

function getWorkspaceLink(workspace: Workspace, templatePath?: string) {
  return `/workspaces/${workspace.id}?notebook_path=${encodeURIComponent(templatePath ?? workspace.path)}`;
}

function isRunningWorkspace(workspace: MergedWorkspace) {
  return workspace.jobs.some((job) => job.status === 'running' || job.status === 'pending');
}

function isRunningJob(job: WorkspaceJob) {
  return job.status === 'running' || job.status === 'pending';
}

export {
  mergeJobsIntoWorkspaces,
  condenseJobs,
  locationIfJobRunning,
  getWorkspaceLink,
  getWorkspaceHeaders,
  getWorkspaceJob,
  isRunningWorkspace,
  isRunningJob,
};
