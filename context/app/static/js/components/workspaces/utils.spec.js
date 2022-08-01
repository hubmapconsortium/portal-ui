import { mergeJobsIntoWorkspaces } from './utils';

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
