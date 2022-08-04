import { mergeJobsIntoWorkspaces, condenseJobs } from './utils';

test('it should merge jobs into workspaces', () => {
  const workspaces = [{ id: 1, other_ws_info: true }];
  const jobs = [{ id: 42, workspace_id: 1, other_job_info: true }];
  const mergedWorkspaces = mergeJobsIntoWorkspaces(jobs, workspaces);
  expect(mergedWorkspaces).toEqual([
    {
      id: 1,
      other_ws_info: true,
      jobs: [
        {
          id: 42,
          workspace_id: 1,
          other_job_info: true,
        },
      ],
    },
  ]);
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
  expect(job).toEqual({ status: 'Active', url: 'http://example.com/this' });
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
  expect(job).toEqual({ status: 'Activating' });
});

test('it should map unknown status codes', () => {
  const jobs = [
    {
      status: 'other',
    },
  ];
  const job = condenseJobs(jobs);
  expect(job).toEqual({ status: 'Inactive' });
});

test('it should return null for an empty list', () => {
  const jobs = [];
  const job = condenseJobs(jobs);
  expect(job).toEqual(null);
});
