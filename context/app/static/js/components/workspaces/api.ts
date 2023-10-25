import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { useCallback } from 'react';

import { useAppContext } from '../Contexts';
import { Workspace, WorkspaceAPIResponse, WorkspaceJob } from './types';
import { getWorkspaceHeaders } from './utils';

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
  const { data, isLoading, ...rest } = useSWR([apiURLs.jobs, headers], ([url, head]) => fetchJobs(url, head), {
    revalidateOnFocus: true,
  });
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
  const { data, isLoading, ...rest } = useSWR(
    [apiURLs.workspaces, headers],
    ([url, head]) => fetchWorkspaces(url, head),
    {
      revalidateOnFocus: true,
    },
  );
  const workspaces = data?.data?.workspaces ?? [];
  return { workspaces, isLoading, ...rest };
}

export function useStopWorkspace() {
  const { stopJob, isStoppingJob } = useStopJob();
  const { jobs } = useJobs();

  const stopWorkspace = useCallback(
    async (workspaceId: number) => {
      await Promise.all(jobs.filter((j) => j.workspace_id === workspaceId).map((j) => stopJob(j.id)));
    },
    [jobs, stopJob],
  );

  return { stopWorkspace, isStoppingWorkspace: isStoppingJob };
}

async function fetchDeleteWorkspace(
  _key: string,
  { arg: { workspaceId, headers, url } }: { arg: { headers: HeadersInit; workspaceId: number; url: string } },
) {
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
  return useSWR(api.jobTypes, fetchJobTypes);
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

interface CreateWorkspaceAndNotebookArgs extends APIAction {
  body: unknown;
}

interface CreateWorkspaceAndNotebookResponse {
  workspace_id: number;
  notebook_path: string;
}

async function createWorkspaceAndNotebook(
  _key: string,
  { arg: { body, url, headers } }: { arg: CreateWorkspaceAndNotebookArgs },
) {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers,
  });
  if (!response.ok) {
    console.error('Create workspace failed', response);
  }
  const { workspace_id, notebook_path } = (await response.json()) as CreateWorkspaceAndNotebookResponse;
  return { workspace_id, notebook_path };
}

export function useCreateWorkspace() {
  const api = useWorkspacesApiURLs();
  const headers = useWorkspaceHeaders();
  const { trigger, isMutating } = useSWRMutation('create-workspace', createWorkspaceAndNotebook);
  const createWorkspace = useCallback(
    async (path: string, body: unknown) => {
      return trigger({
        url: api.createWorkspaceFromNotebookPath(path),
        body,
        headers,
      });
    },
    [trigger, api, headers],
  );

  const createWorkspaceFromTemplates = useCallback(
    (body: unknown) => {
      return trigger({
        url: api.createWorkspaceFromTemplates,
        body,
        headers,
      });
    },
    [trigger, api, headers],
  );

  return { createWorkspace, createWorkspaceFromTemplates, isCreatingWorkspace: isMutating };
}

export function useCreateAndLaunchWorkspace() {
  const { createWorkspace, createWorkspaceFromTemplates, isCreatingWorkspace } = useCreateWorkspace();
  const { startWorkspace } = useStartWorkspace();

  const createAndLaunchWorkspace = useCallback(
    async ({ path, body, templatePath }: { path?: string; body: unknown; templatePath?: string }) => {
      // `path` should be defined if the user is creating a workspace from a notebook. (legacy dialog)
      // `templatePath` should be defined if the user is creating a workspace from template(s). (new dialog)
      // Once we remove the legacy dialog, we can remove the `path` check.
      const promise = path ? createWorkspace(path, body) : createWorkspaceFromTemplates(body);
      const { workspace_id, notebook_path } = await promise;
      await startWorkspace(workspace_id);

      const pathToUse = templatePath ?? notebook_path;

      if (workspace_id && pathToUse) {
        window.open(`/workspaces/${workspace_id}?notebook_path=${encodeURIComponent(pathToUse)}`, '_blank');
      }
    },
    [createWorkspace, createWorkspaceFromTemplates, startWorkspace],
  );

  return { createAndLaunchWorkspace, isCreatingWorkspace };
}
