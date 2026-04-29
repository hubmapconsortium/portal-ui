import { renderHook } from '@testing-library/react';
import type { DownloadAction, DownloadActionContext } from 'udi-yac';
import { useAppContext } from 'js/components/Contexts';
import { checkAndDownloadFile } from 'js/helpers/download';
import useSaySeeDownloadActions from './saySeeDownloadActions';
import useOpenInWorkspacesTrigger from './openInWorkspacesStore';

jest.mock('js/helpers/trackers');
jest.mock('js/components/Contexts', () => ({
  useAppContext: jest.fn(),
}));
jest.mock('js/helpers/download', () => ({
  checkAndDownloadFile: jest.fn().mockResolvedValue(undefined),
}));

const mockUseAppContext = jest.mocked(useAppContext);
const mockCheckAndDownloadFile = jest.mocked(checkAndDownloadFile);

function buildCtx(rowsBySource: { source: string; rows: Record<string, unknown>[] }[]): DownloadActionContext {
  return { rowsBySource, filters: {}, dataPackage: null } as unknown as DownloadActionContext;
}

function runAction(action: DownloadAction, ctx: DownloadActionContext) {
  void action.onClick(ctx);
}

let blobCounter = 0;
let createObjectURLSpy: jest.SpyInstance;

beforeEach(() => {
  jest.clearAllMocks();
  blobCounter = 0;
  createObjectURLSpy = jest.spyOn(URL, 'createObjectURL').mockImplementation(() => {
    return `blob:test-${++blobCounter}`;
  });
  useOpenInWorkspacesTrigger.setState({ pending: null });
  mockUseAppContext.mockReturnValue({ isWorkspacesUser: false } as unknown as ReturnType<typeof useAppContext>);
});

afterEach(() => {
  createObjectURLSpy.mockRestore();
});

async function lastBlobText(): Promise<{ text: string; type: string }> {
  const calls = createObjectURLSpy.mock.calls as [Blob][];
  const blob = calls.at(-1)![0];
  return { text: await blob.text(), type: blob.type };
}

describe('useSaySeeDownloadActions', () => {
  it('returns three ID actions for a non-Workspaces user', () => {
    const { result } = renderHook(() => useSaySeeDownloadActions());
    expect(result.current.map((a) => a.label)).toEqual([
      'Download Donor HuBMAP IDs',
      'Download Sample HuBMAP IDs',
      'Download Dataset HuBMAP IDs',
    ]);
  });

  it('appends the Workspaces action when isWorkspacesUser is true', () => {
    mockUseAppContext.mockReturnValue({ isWorkspacesUser: true } as unknown as ReturnType<typeof useAppContext>);
    const { result } = renderHook(() => useSaySeeDownloadActions());
    expect(result.current.map((a) => a.label)).toEqual([
      'Download Donor HuBMAP IDs',
      'Download Sample HuBMAP IDs',
      'Download Dataset HuBMAP IDs',
      'Open Selected Datasets in Workspaces',
    ]);
  });

  it('marks every action disabled when there are no rows for its source', () => {
    mockUseAppContext.mockReturnValue({ isWorkspacesUser: true } as unknown as ReturnType<typeof useAppContext>);
    const { result } = renderHook(() => useSaySeeDownloadActions());
    const ctx = buildCtx([]);
    result.current.forEach((action) => {
      const disabled = typeof action.disabled === 'function' ? action.disabled(ctx) : action.disabled;
      expect(disabled).toBe(true);
    });
  });

  it('downloads dataset HuBMAP IDs in bulk-manifest format under the manifest.txt filename', async () => {
    const { result } = renderHook(() => useSaySeeDownloadActions());
    const ctx = buildCtx([{ source: 'datasets', rows: [{ hubmap_id: 'HBM1.AAA' }, { hubmap_id: 'HBM2.BBB' }] }]);
    const datasetAction = result.current.find((a) => a.label === 'Download Dataset HuBMAP IDs')!;

    runAction(datasetAction, ctx);

    const { text, type } = await lastBlobText();
    expect(text).toBe('HBM1.AAA /\nHBM2.BBB /');
    expect(type).toBe('text/plain');
    expect(mockCheckAndDownloadFile).toHaveBeenCalledWith({
      url: 'blob:test-1',
      fileName: 'manifest.txt',
    });
  });

  it('downloads donor and sample IDs as plain newline-separated lists with no header', async () => {
    const { result } = renderHook(() => useSaySeeDownloadActions());
    const ctx = buildCtx([
      { source: 'donors', rows: [{ hubmap_id: 'HBM-D-1' }, { hubmap_id: 'HBM-D-2' }] },
      { source: 'samples', rows: [{ hubmap_id: 'HBM-S-1' }] },
    ]);

    runAction(result.current.find((a) => a.label === 'Download Donor HuBMAP IDs')!, ctx);
    expect((await lastBlobText()).text).toBe('HBM-D-1\nHBM-D-2');
    expect(mockCheckAndDownloadFile).toHaveBeenLastCalledWith({
      url: 'blob:test-1',
      fileName: 'hubmap-donor-ids.txt',
    });

    runAction(result.current.find((a) => a.label === 'Download Sample HuBMAP IDs')!, ctx);
    expect((await lastBlobText()).text).toBe('HBM-S-1');
    expect(mockCheckAndDownloadFile).toHaveBeenLastCalledWith({
      url: 'blob:test-2',
      fileName: 'hubmap-sample-ids.txt',
    });
  });

  it('skips download and store update when the source has no rows', () => {
    mockUseAppContext.mockReturnValue({ isWorkspacesUser: true } as unknown as ReturnType<typeof useAppContext>);
    const { result } = renderHook(() => useSaySeeDownloadActions());
    const ctx = buildCtx([{ source: 'datasets', rows: [] }]);

    runAction(result.current.find((a) => a.label === 'Download Dataset HuBMAP IDs')!, ctx);
    runAction(result.current.find((a) => a.label === 'Open Selected Datasets in Workspaces')!, ctx);

    expect(mockCheckAndDownloadFile).not.toHaveBeenCalled();
    expect(useOpenInWorkspacesTrigger.getState().pending).toBeNull();
  });

  it('Open Selected Datasets in Workspaces pushes dataset ids into the trigger store', () => {
    mockUseAppContext.mockReturnValue({ isWorkspacesUser: true } as unknown as ReturnType<typeof useAppContext>);
    const { result } = renderHook(() => useSaySeeDownloadActions());
    const ctx = buildCtx([{ source: 'datasets', rows: [{ hubmap_id: 'HBM1.AAA' }, { hubmap_id: 'HBM2.BBB' }] }]);

    runAction(result.current.find((a) => a.label === 'Open Selected Datasets in Workspaces')!, ctx);

    expect(useOpenInWorkspacesTrigger.getState().pending?.ids).toEqual(['HBM1.AAA', 'HBM2.BBB']);
  });
});
