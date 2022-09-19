import { mergeJobsIntoWorkspaces, condenseJobs } from './utils';

const workspace_details = {
  request_workspace_details: {
    files: [{ name: 'workspace.ipynb' }],
  },
};

test('it should merge jobs into workspaces', () => {
  const workspaces = [{ id: 1, other_ws_info: true, status: 'active', workspace_details }];
  const jobs = [{ id: 42, workspace_id: 1, other_job_info: true }];
  const mergedWorkspaces = mergeJobsIntoWorkspaces(jobs, workspaces);
  expect(mergedWorkspaces).toEqual([
    {
      id: 1,
      other_ws_info: true,
      status: 'active',
      path: 'workspace.ipynb',
      jobs,
      workspace_details,
    },
  ]);
});

test('it should filter out workspaces that are not "active" or "idle"', () => {
  const workspaces = [
    { id: 1, status: 'active', workspace_details },
    { id: 2, status: 'idle', workspace_details },
    { id: 3, status: 'other', workspace_details },
  ];
  const jobs = [];
  const mergedWorkspaces = mergeJobsIntoWorkspaces(jobs, workspaces);
  expect(mergedWorkspaces).toEqual([
    { id: 1, status: 'active', jobs: [], path: 'workspace.ipynb', workspace_details },
    { id: 2, status: 'idle', jobs: [], path: 'workspace.ipynb', workspace_details },
  ]);
});

test('it should only provide a path if there is exactly one notebook', () => {
  const workspaces = [
    {
      id: 0,
      status: 'active',
      workspace_details: {
        request_workspace_details: {
          files: [], // too few
        },
      },
    },
    {
      id: 2,
      status: 'active',
      workspace_details: {
        request_workspace_details: {
          files: [{ name: 'workspace1.ipynb' }, { name: 'workspace2.ipynb' }], // too many... take first
        },
      },
    },
    {
      id: 1,
      status: 'active',
      workspace_details, // just right!
    },
  ];
  const jobs = [];
  const mergedWorkspaces = mergeJobsIntoWorkspaces(jobs, workspaces);
  expect(mergedWorkspaces.map((ws) => ws.path)).toEqual(['', 'workspace1.ipynb', 'workspace.ipynb']);
});

test('it should pick one active job if available', () => {
  const jobs = [
    {
      status: 'pending',
    },
    {
      status: 'running',
      job_details: {
        current_job_details: { connection_details: { url_domain: 'http://example.com/', url_path: 'this' } },
      },
    },
    {
      status: 'running',
      job_details: {
        current_job_details: { connection_details: { url_domain: 'http://example.com/', url_path: 'not-this' } },
      },
    },
    {
      status: 'other',
    },
  ];
  const job = condenseJobs(jobs);
  expect(job).toEqual({ allowNew: false, status: 'Active', url: 'http://example.com/this' });
});

test('it should pick an activating job if no active jobs are available', () => {
  const jobs = [
    {
      status: 'other',
    },
    {
      status: 'pending',
    },
  ];
  const job = condenseJobs(jobs);
  expect(job).toEqual({ allowNew: false, status: 'Activating', message: 'Activating' });
});

test('it should map unknown status codes', () => {
  const jobs = [
    {
      status: 'other',
    },
  ];
  const job = condenseJobs(jobs);
  expect(job).toEqual({ allowNew: true, status: 'Inactive' });
});

test('it should return null for an empty list', () => {
  const jobs = [];
  const job = condenseJobs(jobs);
  expect(job).toEqual({ allowNew: true, status: undefined });
});
