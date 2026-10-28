import { act, renderHook } from '@testing-library/react';

import { getWorkspaceJob } from 'js/components/workspaces/utils';
import useWorkspacesPleaseWait from './hooks';

const handleStopWorkspace = vi.fn();

vi.mock('js/components/Contexts', () => ({
  useAppContext: () => ({ workspacesEndpoint: 'https://workspaces', workspacesToken: 'token' }),
}));
vi.mock('js/components/workspaces/hooks', () => ({
  useWorkspacesList: () => ({ handleStopWorkspace }),
}));
vi.mock('js/components/workspaces/utils', () => ({
  getWorkspaceJob: vi.fn(),
}));

const mockGetWorkspaceJob = vi.mocked(getWorkspaceJob);

beforeEach(() => {
  vi.useFakeTimers();
  mockGetWorkspaceJob.mockReset();
  handleStopWorkspace.mockReset();
});
afterEach(() => {
  vi.useRealTimers();
});

async function advance(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

describe('useWorkspacesPleaseWait', () => {
  test('stops polling with a message when the job never starts', async () => {
    mockGetWorkspaceJob.mockResolvedValue({ status: 'Inactive', allowNew: true });
    const { result } = renderHook(() => useWorkspacesPleaseWait(1));

    await advance(95 * 1000);
    expect(result.current.message).toMatch(/did not start/);

    const calls = mockGetWorkspaceJob.mock.calls.length;
    await advance(10 * 1000);
    expect(mockGetWorkspaceJob.mock.calls.length).toBe(calls);
  });

  test('sends one stop request when activation times out, even while it is pending', async () => {
    mockGetWorkspaceJob.mockResolvedValue({ status: 'Activating', allowNew: false, message: 'Activating' });
    handleStopWorkspace.mockReturnValue(new Promise(() => {}));
    renderHook(() => useWorkspacesPleaseWait(1));

    await advance(5 * 60 * 1000 + 10 * 1000);
    expect(handleStopWorkspace).toHaveBeenCalledTimes(1);
  });

  test('does not start a poll while the previous one is still in flight', async () => {
    mockGetWorkspaceJob.mockReturnValue(new Promise(() => {}));
    renderHook(() => useWorkspacesPleaseWait(1));

    await advance(5 * 1000);
    expect(mockGetWorkspaceJob).toHaveBeenCalledTimes(1);
  });
});
