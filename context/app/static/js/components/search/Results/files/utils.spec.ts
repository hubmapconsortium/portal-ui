import { buildManifest, getFileTypes, getOrganLabels, sumFileSizes, FileDocument } from './utils';
import { countSelectedDatasets, getDatasetSelectionState, useFilesSelectionStore } from './useFilesSelectionStore';

const hubmapIdsByUuid = new Map([
  ['uuid-a', 'HBM111.AAAA.111'],
  ['uuid-b', 'HBM222.BBBB.222'],
]);

describe('buildManifest', () => {
  test('emits a directory line for a whole-dataset selection', () => {
    // `/` lets the CLT pull the entire dataset without enumerating its files -- which matters
    // because a dataset can hold thousands.
    const manifest = buildManifest({
      wholeDatasets: new Set(['uuid-a']),
      selectedFiles: new Map(),
      hubmapIdsByUuid,
    });
    expect(manifest).toBe('HBM111.AAAA.111 /');
  });

  test('emits one line per file for a partial selection', () => {
    const manifest = buildManifest({
      wholeDatasets: new Set(),
      selectedFiles: new Map([['uuid-a', new Set(['expr.h5ad', 'metadata.tsv'])]]),
      hubmapIdsByUuid,
    });
    expect(manifest).toBe('HBM111.AAAA.111 expr.h5ad\nHBM111.AAAA.111 metadata.tsv');
  });

  test('combines whole and partial selections across datasets', () => {
    const manifest = buildManifest({
      wholeDatasets: new Set(['uuid-b']),
      selectedFiles: new Map([['uuid-a', new Set(['expr.h5ad'])]]),
      hubmapIdsByUuid,
    });
    expect(manifest.split('\n')).toEqual(['HBM222.BBBB.222 /', 'HBM111.AAAA.111 expr.h5ad']);
  });

  test('is deterministic regardless of selection order', () => {
    const a = buildManifest({
      wholeDatasets: new Set(['uuid-b', 'uuid-a']),
      selectedFiles: new Map(),
      hubmapIdsByUuid,
    });
    const b = buildManifest({
      wholeDatasets: new Set(['uuid-a', 'uuid-b']),
      selectedFiles: new Map(),
      hubmapIdsByUuid,
    });
    expect(a).toBe(b);
  });

  test('skips datasets whose HuBMAP ID is unknown rather than emitting a broken line', () => {
    const manifest = buildManifest({
      wholeDatasets: new Set(['uuid-missing']),
      selectedFiles: new Map(),
      hubmapIdsByUuid,
    });
    expect(manifest).toBe('');
  });
});

describe('row derivations', () => {
  const files: FileDocument[] = [
    { dataset_uuid: 'u', dataset_hubmap_id: 'H', rel_path: 'a.h5ad', file_extension: '.h5ad', size: 10 },
    { dataset_uuid: 'u', dataset_hubmap_id: 'H', rel_path: 'b.tsv', file_extension: '.tsv', size: 5 },
    { dataset_uuid: 'u', dataset_hubmap_id: 'H', rel_path: 'c.h5ad', file_extension: '.h5ad', size: 1 },
  ];

  test('file types are deduplicated and sorted', () => {
    expect(getFileTypes(files)).toEqual(['.h5ad', '.tsv']);
  });

  test('sizes sum, treating a missing size as zero', () => {
    expect(sumFileSizes([...files, { dataset_uuid: 'u', dataset_hubmap_id: 'H', rel_path: 'd' }])).toBe(16);
  });

  test('organ labels are deduplicated, since a dataset can repeat an organ', () => {
    const source: FileDocument = {
      dataset_uuid: 'u',
      dataset_hubmap_id: 'H',
      rel_path: 'a',
      organs: [{ label: 'Spleen' }, { label: 'Spleen' }, { label: 'Thymus' }, {}],
    };
    expect(getOrganLabels(source)).toEqual(['Spleen', 'Thymus']);
  });
});

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
    expect(state.selectedFiles.get('uuid-a')).toEqual(new Set(['expr.h5ad']));

    // And selecting the whole dataset again clears the individual files.
    useFilesSelectionStore.getState().toggleWholeDataset('uuid-a');
    expect(useFilesSelectionStore.getState().selectedFiles.has('uuid-a')).toBe(false);
  });

  test('deselecting the last file drops the dataset entry entirely', () => {
    const { toggleFile } = useFilesSelectionStore.getState();
    toggleFile('uuid-a', 'expr.h5ad');
    useFilesSelectionStore.getState().toggleFile('uuid-a', 'expr.h5ad');
    // An empty set would otherwise read as "partially selected" in the row checkbox.
    expect(useFilesSelectionStore.getState().selectedFiles.has('uuid-a')).toBe(false);
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
    useFilesSelectionStore.getState().setDatasetFiles('uuid-a', ['a', 'b']);
    expect(useFilesSelectionStore.getState().selectedFiles.get('uuid-a')).toEqual(new Set(['a', 'b']));

    useFilesSelectionStore.getState().setDatasetFiles('uuid-a', []);
    expect(useFilesSelectionStore.getState().selectedFiles.has('uuid-a')).toBe(false);
  });
});
