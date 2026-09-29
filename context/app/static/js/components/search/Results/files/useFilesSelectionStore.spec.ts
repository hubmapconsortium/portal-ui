import { countSelectedDatasets, getDatasetSelectionState, useFilesSelectionStore } from './useFilesSelectionStore';

describe('useFilesSelectionStore', () => {
  beforeEach(() => {
    useFilesSelectionStore.getState().clearAll();
  });

  test('whole and partial selection are mutually exclusive per dataset', () => {
    const { toggleWholeDataset, toggleFile } = useFilesSelectionStore.getState();

    toggleWholeDataset('uuid-a');
    expect(useFilesSelectionStore.getState().wholeDatasets.has('uuid-a')).toBe(true);

    // Picking an individual file demotes the row from whole to partial.
    toggleFile('uuid-a', 'expr.h5ad');
    const state = useFilesSelectionStore.getState();
    expect(state.wholeDatasets.has('uuid-a')).toBe(false);
    expect(state.selectedFilesByDataset.get('uuid-a')).toEqual(new Set(['expr.h5ad']));

    // And selecting the whole dataset again clears the individual files.
    useFilesSelectionStore.getState().toggleWholeDataset('uuid-a');
    expect(useFilesSelectionStore.getState().selectedFilesByDataset.has('uuid-a')).toBe(false);
  });

  test('deselecting the last file drops the dataset entry entirely', () => {
    useFilesSelectionStore.getState().toggleFile('uuid-a', 'expr.h5ad');
    useFilesSelectionStore.getState().toggleFile('uuid-a', 'expr.h5ad');
    // An empty set would otherwise read as "partially selected" in the row checkbox.
    expect(useFilesSelectionStore.getState().selectedFilesByDataset.has('uuid-a')).toBe(false);
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

  describe('addFiles', () => {
    test('merges into existing selections rather than replacing them', () => {
      useFilesSelectionStore.getState().toggleFile('uuid-a', 'already.h5ad');
      useFilesSelectionStore.getState().addFiles(new Map([['uuid-a', ['added.h5ad']]]));
      expect(useFilesSelectionStore.getState().selectedFilesByDataset.get('uuid-a')).toEqual(
        new Set(['already.h5ad', 'added.h5ad']),
      );
    });

    test('leaves a whole-dataset selection alone, since it is already a superset', () => {
      useFilesSelectionStore.getState().toggleWholeDataset('uuid-a');
      useFilesSelectionStore.getState().addFiles(new Map([['uuid-a', ['expr.h5ad']]]));
      const state = useFilesSelectionStore.getState();
      expect(state.wholeDatasets.has('uuid-a')).toBe(true);
      expect(state.selectedFilesByDataset.has('uuid-a')).toBe(false);
    });

    test('adds many datasets in one update', () => {
      useFilesSelectionStore.getState().addFiles(
        new Map([
          ['uuid-a', ['a.h5ad']],
          ['uuid-b', ['b.h5ad', 'c.h5ad']],
        ]),
      );
      const state = useFilesSelectionStore.getState();
      expect(state.selectedFilesByDataset.get('uuid-a')).toEqual(new Set(['a.h5ad']));
      expect(state.selectedFilesByDataset.get('uuid-b')).toEqual(new Set(['b.h5ad', 'c.h5ad']));
    });

    test('ignores datasets with no files', () => {
      useFilesSelectionStore.getState().addFiles(new Map([['uuid-a', []]]));
      expect(useFilesSelectionStore.getState().selectedFilesByDataset.has('uuid-a')).toBe(false);
    });
  });

  test('clearDatasets drops the selection', () => {
    useFilesSelectionStore.getState().toggleWholeDataset('uuid-a');
    useFilesSelectionStore.getState().toggleFile('uuid-b', 'x');
    useFilesSelectionStore.getState().clearDatasets(['uuid-a', 'uuid-b']);
    const state = useFilesSelectionStore.getState();
    expect(state.wholeDatasets.size).toBe(0);
    expect(state.selectedFilesByDataset.size).toBe(0);
  });
});
