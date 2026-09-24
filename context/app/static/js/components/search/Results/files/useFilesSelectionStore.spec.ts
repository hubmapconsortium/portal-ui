import { countSelectedDatasets, getDatasetSelectionState, useFilesSelectionStore } from './useFilesSelectionStore';

const ID_A = 'HBM111.AAAA.111';
const ID_B = 'HBM222.BBBB.222';

describe('useFilesSelectionStore', () => {
  beforeEach(() => {
    useFilesSelectionStore.getState().clearAll();
  });

  test('whole and partial selection are mutually exclusive per dataset', () => {
    const { toggleWholeDataset, toggleFile } = useFilesSelectionStore.getState();

    toggleWholeDataset('uuid-a', ID_A);
    expect(useFilesSelectionStore.getState().wholeDatasets.has('uuid-a')).toBe(true);

    // Picking an individual file demotes the row from whole to partial.
    toggleFile('uuid-a', ID_A, 'expr.h5ad');
    const state = useFilesSelectionStore.getState();
    expect(state.wholeDatasets.has('uuid-a')).toBe(false);
    expect(state.selectedFiles.get('uuid-a')).toEqual(new Set(['expr.h5ad']));

    // And selecting the whole dataset again clears the individual files.
    useFilesSelectionStore.getState().toggleWholeDataset('uuid-a', ID_A);
    expect(useFilesSelectionStore.getState().selectedFiles.has('uuid-a')).toBe(false);
  });

  test('deselecting the last file drops the dataset entry entirely', () => {
    useFilesSelectionStore.getState().toggleFile('uuid-a', ID_A, 'expr.h5ad');
    useFilesSelectionStore.getState().toggleFile('uuid-a', ID_A, 'expr.h5ad');
    // An empty set would otherwise read as "partially selected" in the row checkbox.
    expect(useFilesSelectionStore.getState().selectedFiles.has('uuid-a')).toBe(false);
  });

  test('records the HuBMAP ID of every selected dataset', () => {
    // The manifest needs an ID per dataset, and "add all matching files" selects datasets that
    // were never rendered, so the IDs cannot come from the loaded rows.
    useFilesSelectionStore.getState().toggleWholeDataset('uuid-a', ID_A);
    useFilesSelectionStore.getState().toggleFile('uuid-b', ID_B, 'expr.h5ad');
    expect(useFilesSelectionStore.getState().hubmapIds).toEqual(
      new Map([
        ['uuid-a', ID_A],
        ['uuid-b', ID_B],
      ]),
    );
  });

  test('row checkbox state distinguishes none, partial and whole', () => {
    const whole = new Set(['uuid-a']);
    const partial = new Map([['uuid-b', new Set(['x'])]]);

    expect(getDatasetSelectionState('uuid-a', whole, partial)).toBe('whole');
    expect(getDatasetSelectionState('uuid-b', whole, partial)).toBe('partial');
    expect(getDatasetSelectionState('uuid-c', whole, partial)).toBe('none');
  });

  test('selected dataset count counts a dataset once however it is selected', () => {
    expect(countSelectedDatasets(new Set(['uuid-a']), new Map([['uuid-b', new Set(['x'])]]))).toBe(2);
    // Defensive: the store keeps these disjoint, but the count must not double up.
    expect(countSelectedDatasets(new Set(['uuid-a']), new Map([['uuid-a', new Set(['x'])]]))).toBe(1);
  });

  test('setDatasetFiles replaces a dataset selection wholesale', () => {
    useFilesSelectionStore.getState().setDatasetFiles('uuid-a', ID_A, ['a', 'b']);
    expect(useFilesSelectionStore.getState().selectedFiles.get('uuid-a')).toEqual(new Set(['a', 'b']));

    useFilesSelectionStore.getState().setDatasetFiles('uuid-a', ID_A, []);
    expect(useFilesSelectionStore.getState().selectedFiles.has('uuid-a')).toBe(false);
  });

  describe('addFiles', () => {
    test('merges into existing selections rather than replacing them', () => {
      useFilesSelectionStore.getState().toggleFile('uuid-a', ID_A, 'already.h5ad');
      useFilesSelectionStore.getState().addFiles(new Map([['uuid-a', { hubmapId: ID_A, relPaths: ['added.h5ad'] }]]));
      expect(useFilesSelectionStore.getState().selectedFiles.get('uuid-a')).toEqual(
        new Set(['already.h5ad', 'added.h5ad']),
      );
    });

    test('leaves a whole-dataset selection alone, since it is already a superset', () => {
      useFilesSelectionStore.getState().toggleWholeDataset('uuid-a', ID_A);
      useFilesSelectionStore.getState().addFiles(new Map([['uuid-a', { hubmapId: ID_A, relPaths: ['expr.h5ad'] }]]));
      const state = useFilesSelectionStore.getState();
      expect(state.wholeDatasets.has('uuid-a')).toBe(true);
      expect(state.selectedFiles.has('uuid-a')).toBe(false);
    });

    test('adds many datasets in one update and records their IDs', () => {
      useFilesSelectionStore.getState().addFiles(
        new Map([
          ['uuid-a', { hubmapId: ID_A, relPaths: ['a.h5ad'] }],
          ['uuid-b', { hubmapId: ID_B, relPaths: ['b.h5ad', 'c.h5ad'] }],
        ]),
      );
      const state = useFilesSelectionStore.getState();
      expect(state.selectedFiles.get('uuid-a')).toEqual(new Set(['a.h5ad']));
      expect(state.selectedFiles.get('uuid-b')).toEqual(new Set(['b.h5ad', 'c.h5ad']));
      expect(state.hubmapIds.get('uuid-b')).toBe(ID_B);
    });

    test('ignores datasets with no files', () => {
      useFilesSelectionStore.getState().addFiles(new Map([['uuid-a', { hubmapId: ID_A, relPaths: [] }]]));
      expect(useFilesSelectionStore.getState().selectedFiles.has('uuid-a')).toBe(false);
    });
  });

  test('clearDatasets drops the selection and the recorded ID', () => {
    useFilesSelectionStore.getState().toggleWholeDataset('uuid-a', ID_A);
    useFilesSelectionStore.getState().toggleFile('uuid-b', ID_B, 'x');
    useFilesSelectionStore.getState().clearDatasets(['uuid-a', 'uuid-b']);
    const state = useFilesSelectionStore.getState();
    expect(state.wholeDatasets.size).toBe(0);
    expect(state.selectedFiles.size).toBe(0);
    expect(state.hubmapIds.size).toBe(0);
  });
});
