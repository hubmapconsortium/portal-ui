import { mergeJobsIntoWorkspaces, condenseJobs } from './utils';

const workspace_details = {
  current_workspace_details: {
    files: [{ name: 'workspace.ipynb' }],
  },
  request_workspace_details: {
    files: [],
  },
};

const workspace_details_request = {
  current_workspace_details: {
    files: [],
  },
  request_workspace_details: {
    files: [{ name: 'workspace.ipynb' }],
  },
};

describe('mergeJobsIntoWorkspaces', () => {
  test('it should merge jobs into workspaces', () => {
    const workspaces = [{ id: 1, other_ws_info: true, status: 'active', workspace_details, name: 'ws1' }];
    const jobs = [{ id: 42, workspace_id: 1, other_job_info: true, status: 'running' }];
    const mergedWorkspaces = mergeJobsIntoWorkspaces(jobs, workspaces);
    expect(mergedWorkspaces).toEqual([
      {
        id: 1,
        name: 'ws1',
        other_ws_info: true,
        status: 'active',
        path: '/workspace.ipynb',
        jobs,
        workspace_details,
      },
    ]);
  });

  test('it should filter out workspaces that are not "active" or "idle"', () => {
    const workspaces = [
      { id: 1, status: 'active', workspace_details, name: 'a' },
      { id: 2, status: 'idle', workspace_details, name: 'b' },
      { id: 3, status: 'deleting', workspace_details, name: 'c' },
      { id: 4, status: 'error', workspace_details, name: 'd' },
    ];
    const jobs = [];
    const mergedWorkspaces = mergeJobsIntoWorkspaces(jobs, workspaces);
    expect(mergedWorkspaces).toEqual([
      { id: 1, status: 'active', name: 'a', jobs: [], path: '/workspace.ipynb', workspace_details },
      { id: 2, status: 'idle', name: 'b', jobs: [], path: '/workspace.ipynb', workspace_details },
    ]);
  });

  test('it should return the active workspace first then sort by name', () => {
    const workspaces = [
      { id: 1, status: 'idle', workspace_details, name: 'a' },
      { id: 2, status: 'active', workspace_details, name: 'b' },
      { id: 3, status: 'idle', workspace_details, name: 'c' },
    ];
    const jobs = [];
    const mergedWorkspaces = mergeJobsIntoWorkspaces(jobs, workspaces);
    expect(mergedWorkspaces).toEqual([
      { id: 2, status: 'active', name: 'b', jobs: [], path: '/workspace.ipynb', workspace_details },
      { id: 1, status: 'idle', name: 'a', jobs: [], path: '/workspace.ipynb', workspace_details },
      { id: 3, status: 'idle', name: 'c', jobs: [], path: '/workspace.ipynb', workspace_details },
    ]);
  });

  test('it should error on unexpected status', () => {
    const workspaces = [{ id: 1, status: 'unexpected' }];
    const jobs = [];
    expect(() => mergeJobsIntoWorkspaces(jobs, workspaces)).toThrow('Unexpected workspace status');
  });

  test('it should only provide a path if there is exactly one notebook', () => {
    const workspaces = [
      {
        id: -1,
        name: 'a',
        status: 'active',
        workspace_details: {
          current_workspace_details: {}, // Response currently not guaranteed to have "files" key.
          request_workspace_details: {},
        },
      },
      {
        id: 0,
        name: 'b',
        status: 'active',
        workspace_details: {
          current_workspace_details: {
            files: [], // too few
          },
          request_workspace_details: {
            ...workspace_details.request_workspace_details,
          },
        },
      },
      {
        id: 2,
        name: 'c',
        status: 'active',
        workspace_details: {
          current_workspace_details: {
            files: [{ name: 'workspace1.ipynb' }, { name: 'workspace2.ipynb' }], // too many... take first
          },
          request_workspace_details: {
            ...workspace_details.request_workspace_details,
          },
        },
      },
      {
        id: 1,
        name: 'd',
        status: 'active',
        workspace_details, // just right!
      },
      {
        id: 3,
        name: 'e',
        status: 'active',
        workspace_details: workspace_details_request, // works when `request_workspace_details` has entry and `current_workspace_details` does not
      },
    ];
    const jobs = [];
    const mergedWorkspaces = mergeJobsIntoWorkspaces(jobs, workspaces);
    expect(mergedWorkspaces.map((ws) => ws.path)).toEqual([
      '',
      '',
      '/workspace1.ipynb',
      '/workspace.ipynb',
      '/workspace.ipynb',
    ]);
  });
});

describe('condenseJobs', () => {
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
    ];
    const job = condenseJobs(jobs);
    expect(job).toEqual({ allowNew: false, status: 'Active', url: 'http://example.com/this' });
  });

  test('it should pick an activating job if no active jobs are available', () => {
    const jobs = [
      {
        status: 'failed',
      },
      {
        status: 'pending',
      },
    ];
    const job = condenseJobs(jobs);
    expect(job).toEqual({ allowNew: false, status: 'Activating', message: 'Activating' });
  });

  test('it should return allowNew for an empty list', () => {
    const jobs = [];
    const job = condenseJobs(jobs);
    expect(job).toEqual({ allowNew: true, status: undefined });
  });

  test('it should error on unexpected status', () => {
    const jobs = [
      {
        status: 'unexpected!',
      },
    ];
    expect(() => condenseJobs(jobs)).toThrow('Unexpected job status');
  });
});
