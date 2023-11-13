import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { useCallback } from 'react';

import { trackEvent } from 'js/helpers/trackers';
import { useAppContext } from '../Contexts';
import { Workspace, WorkspaceAPIResponse, WorkspaceJob } from './types';
import { getWorkspaceHeaders, isRunningJob } from './utils';

/**
 * Generates API URLs for various workspaces API actions
 * @param workspacesEndpoint endpoint to use as the base for API URLs
 * @returns an API URL generator
 */
export const apiUrls = (workspacesEndpoint: string) => ({
  get jobTypes(): string {
    return `${workspacesEndpoint}/job_types`;
  },
  get workspaces(): string {
    return `${workspacesEndpoint}/workspaces`;
  },
  get jobs(): string {
    return `${workspacesEndpoint}/jobs`;
  },
  delete(workspaceId: number): string {
    return `${workspacesEndpoint}/workspaces/${workspaceId}`;
  },
  createWorkspaceFromNotebookPath(path: string): string {
    return `/notebooks/${path}`;
  },
  get createWorkspaceFromTemplates(): string {
    return `${workspacesEndpoint}/workspaces/`;
  },
  startWorkspace(workspaceId: number): string {
    return `${workspacesEndpoint}/workspaces/${workspaceId}/start`;
  },
  stopJob(jobId: number): string {
    return `${workspacesEndpoint}/jobs/${jobId}/stop`;
  },
});

export function useWorkspacesApiURLs() {
  const { workspacesEndpoint } = useAppContext();
  return apiUrls(workspacesEndpoint);
}

export function useWorkspaceHeaders(): HeadersInit {
  const { workspacesToken } = useAppContext();
  return getWorkspaceHeaders(workspacesToken);
}

export function useHasWorkspaceAccess() {
  const { workspacesToken } = useAppContext();
  return Boolean(workspacesToken);
}

interface APIAction {
  url: string;
  headers?: HeadersInit;
}

interface StopJobArgs extends APIAction {
  jobId: number;
}

/**
 * Stop a currently-running workspace job
 * @param key Readable key for the current action
 * @param param2.arg.headers The headers to use for the request
 * @param param2.arg.jobId ID of the job to stop
 * @param param2.arg.url The URL to use for the request
 * @returns The response from the server if the request was successful
 */
async function fetchStopJob(_key: string, { arg: { headers, jobId, url } }: { arg: StopJobArgs }) {
  const response = await fetch(url, {
    method: 'PUT',
    headers,
  });
  if (!response.ok) {
    throw Error(`Job stop for job ${jobId} failed`);
  }
  return response;
}

export function useStopJob() {
  const apiURLs = useWorkspacesApiURLs();
  const headers = useWorkspaceHeaders();

  const { trigger, isMutating } = useSWRMutation('stop-job', fetchStopJob);

  const stopJobCallback = useCallback(
    async (jobId: number) => {
      await trigger({
        jobId,
        url: apiURLs.stopJob(jobId),
        headers,
      });
    },
    [apiURLs, headers, trigger],
  );

  return { stopJob: stopJobCallback, isStoppingJob: isMutating };
}

async function fetchJobs(url: string, headers: APIAction['headers']) {
  const response = await fetch(url, { headers });
  const result = (await response.json()) as WorkspaceAPIResponse<{ jobs: WorkspaceJob[] }>;
  if (!result.success) {
    throw Error(`Failed to get jobs: ${result.message}` ?? 'Unknown error');
  }
  return result;
}

export function useJobs() {
  const apiURLs = useWorkspacesApiURLs();
  const headers = useWorkspaceHeaders();
  const hasAccess = useHasWorkspaceAccess();
  const { data, isLoading, ...rest } = useSWR(hasAccess ? [apiURLs.jobs, headers] : null, ([url, head]) =>
    fetchJobs(url, head),
  );
  const jobs = data?.data?.jobs ?? [];
  return { jobs, isLoading, ...rest };
}

export function useWorkspaceJobs(workspaceId: number) {
  const { jobs, isLoading } = useJobs();
  return { jobs: jobs.filter((j) => j.workspace_id === workspaceId), isLoading };
}

async function fetchWorkspaces(url: string, headers: APIAction['headers']) {
  const response = await fetch(url, { headers });
  const result = (await response.json()) as WorkspaceAPIResponse<{ workspaces: Workspace[] }>;
  if (!result.success) {
    throw Error(`Failed to get workspaces: ${result.message ?? 'Unknown Error'}`);
  }
  return result;
}

export function useWorkspaces() {
  const apiURLs = useWorkspacesApiURLs();
  const headers = useWorkspaceHeaders();
  const hasAccess = useHasWorkspaceAccess();
  const { data, isLoading, ...rest } = useSWR(
    hasAccess ? [apiURLs.workspaces, headers] : null,
    ([url, head]) => fetchWorkspaces(url, head),
    { revalidateOnFocus: hasAccess },
  );
  const workspaces = data?.data?.workspaces ?? [];
  return { workspaces, isLoading, ...rest };
}

export function useStopWorkspace() {
  const { stopJob, isStoppingJob } = useStopJob();
  const { jobs } = useJobs();

  const stopWorkspace = useCallback(
    async (workspaceId: number) => {
      trackEvent({
        category: 'Workspace Action',
        action: 'Stop Workspace',
        value: workspaceId,
      });
      await Promise.all(
        jobs.filter((j) => j.workspace_id === workspaceId && isRunningJob(j)).map((j) => stopJob(j.id)),
      );
    },
    [jobs, stopJob],
  );

  return { stopWorkspace, isStoppingWorkspace: isStoppingJob };
}

async function fetchDeleteWorkspace(
  _key: string,
  { arg: { workspaceId, headers, url } }: { arg: { headers: HeadersInit; workspaceId: number; url: string } },
) {
  trackEvent({
    category: 'Workspace Action',
    action: 'Delete Workspace',
    value: workspaceId,
  });
  const response = await fetch(url, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) {
    throw Error(`Workspace deletion for workspace #${workspaceId} failed`);
  }
}

export function useDeleteWorkspace() {
  const { trigger, isMutating } = useSWRMutation('delete-workspace', fetchDeleteWorkspace);
  const api = useWorkspacesApiURLs();
  const headers = useWorkspaceHeaders();

  const deleteWorkspace = useCallback(
    async (workspaceId: number) => {
      await trigger({
        workspaceId,
        url: api.delete(workspaceId),
        headers,
      });
    },
    [headers, api, trigger],
  );

  return { deleteWorkspace, isDeleting: isMutating };
}

async function fetchJobTypes(jobTypesEndpoint: string): Promise<Record<string, { id: number }> | undefined> {
  const response = fetch(jobTypesEndpoint);
  const { data, success, message } = (await (await response).json()) as WorkspaceAPIResponse<{
    job_types: Record<string, { id: number }>;
  }>;
  if (!success) {
    throw new Error(`Failed to get job types: ${message}`);
  }
  return data.job_types;
}

export function useJobTypes() {
  const api = useWorkspacesApiURLs();
  const hasAccess = useHasWorkspaceAccess();
  return useSWR(hasAccess ? api.jobTypes : null, fetchJobTypes);
}

interface WorkspaceActionArgs extends APIAction {
  workspaceId: number;
  jobType: unknown;
  jobDetails: unknown;
}

async function startJob(
  _key: string,
  { arg: { workspaceId, jobDetails, jobType, url, headers } }: { arg: WorkspaceActionArgs },
) {
  trackEvent({
    category: 'Workspace Action',
    action: 'Start Workspace',
    value: { workspaceId, jobDetails, jobType },
  });
  const result = fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      job_type: jobType,
      job_details: jobDetails,
    }),
  });
  if (!(await result).ok) {
    console.error(`Failed to start workspace ${workspaceId}`, result);
  }
}

export function useStartWorkspace() {
  const { data, isLoading: loadingJobTypes } = useJobTypes();
  const api = useWorkspacesApiURLs();
  const headers = useWorkspaceHeaders();
  const { trigger, isMutating } = useSWRMutation('start-workspace', startJob);
  const startWorkspace = useCallback(
    async (workspaceId: number) => {
      if (!data || loadingJobTypes) {
        return undefined;
      }
      if (!data.jupyter_lab) {
        console.error('Failed to get jupyter lab job type');
        return undefined;
      }
      return trigger({
        url: api.startWorkspace(workspaceId),
        jobDetails: {},
        headers,
        jobType: data.jupyter_lab.id,
        workspaceId,
      });
    },
    [data, loadingJobTypes, trigger, api, headers],
  );
  return { startWorkspace, isStartingWorkspace: isMutating };
}

export interface CreateWorkspaceBody {
  name: string;
  description: string;
  workspace_details: {
    globus_groups_token: string;
    files: {
      name: string;
      content?: string;
    }[];
    symlinks: {
      name: string;
      dataset_uuid: string;
    }[];
  };
}

export interface CreateWorkspaceArgs extends APIAction {
  body: CreateWorkspaceBody;
}

async function createWorkspaceFetcher(_key: string, { arg: { body, url, headers } }: { arg: CreateWorkspaceArgs }) {
  trackEvent({
    category: 'Workspace Creation',
    action: 'Create Workspace',
    value: {
      name: body.name,
      description: body.description,
      globus_groups_token: body.workspace_details.globus_groups_token,
      files: body.workspace_details.files.map((f) => f.name),
      symlinks: body.workspace_details.symlinks.map((s) => s.name),
    },
  });
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers,
  });
  if (!response.ok) {
    console.error('Create workspace failed', response);
  }
  const responseJson = (await response.json()) as WorkspaceAPIResponse<{ workspace: Workspace }>;
  if (!responseJson.success) {
    throw new Error(`Failed to create workspace: ${responseJson.message}`);
  }
  return responseJson.data.workspace;
}

export function useCreateWorkspace() {
  const api = useWorkspacesApiURLs();
  const headers = useWorkspaceHeaders();
  const { trigger, isMutating } = useSWRMutation('create-workspace', createWorkspaceFetcher);

  const createWorkspace = useCallback(
    (body: CreateWorkspaceBody) => {
      return trigger({
        url: api.createWorkspaceFromTemplates,
        body,
        headers,
      });
    },
    [trigger, api, headers],
  );

  return { createWorkspace, isCreatingWorkspace: isMutating };
}
