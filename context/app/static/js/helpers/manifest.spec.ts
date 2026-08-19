import { buildManifest, buildWholeDatasetManifest, DATASET_METADATA_FILE } from './manifest';

const hubmapIdsByUuid = new Map([
  ['uuid-a', 'HBM111.AAAA.111'],
  ['uuid-b', 'HBM222.BBBB.222'],
]);

describe('buildManifest', () => {
  test('emits a directory line for a whole-dataset selection', () => {
    // `/` lets the CLT pull the entire dataset without enumerating its files -- which matters
    // because a single dataset can hold hundreds of thousands.
    const manifest = buildManifest({ wholeDatasets: new Set(['uuid-a']), hubmapIdsByUuid });
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
    const a = buildManifest({ wholeDatasets: new Set(['uuid-b', 'uuid-a']), hubmapIdsByUuid });
    const b = buildManifest({ wholeDatasets: new Set(['uuid-a', 'uuid-b']), hubmapIdsByUuid });
    expect(a).toBe(b);
  });

  test('skips datasets whose HuBMAP ID is unknown rather than emitting a broken line', () => {
    const manifest = buildManifest({ wholeDatasets: new Set(['uuid-missing']), hubmapIdsByUuid });
    expect(manifest).toBe('');
  });

  describe('metadata.json', () => {
    test('is added to file-level selections when requested', () => {
      const manifest = buildManifest({
        wholeDatasets: new Set(),
        selectedFiles: new Map([['uuid-a', new Set(['expr.h5ad'])]]),
        hubmapIdsByUuid,
        withMetadataJson: new Set(['uuid-a']),
      });
      // Sorted within the dataset, so `expr.h5ad` precedes `metadata.json`.
      expect(manifest.split('\n')).toEqual(['HBM111.AAAA.111 expr.h5ad', `HBM111.AAAA.111 ${DATASET_METADATA_FILE}`]);
    });

    test('is not duplicated when already selected', () => {
      const manifest = buildManifest({
        wholeDatasets: new Set(),
        selectedFiles: new Map([['uuid-a', new Set([DATASET_METADATA_FILE])]]),
        hubmapIdsByUuid,
        withMetadataJson: new Set(['uuid-a']),
      });
      expect(manifest).toBe(`HBM111.AAAA.111 ${DATASET_METADATA_FILE}`);
    });

    test('is not added to a whole-dataset line, which already covers it', () => {
      const manifest = buildManifest({
        wholeDatasets: new Set(['uuid-a']),
        hubmapIdsByUuid,
        withMetadataJson: new Set(['uuid-a']),
      });
      expect(manifest).toBe('HBM111.AAAA.111 /');
    });
  });
});

describe('buildWholeDatasetManifest', () => {
  test('matches the format the dataset bulk download has always produced', () => {
    // Guards the byte-for-byte equivalence with the previous `ids.join(' /\n') + ' /'` expression,
    // so folding that call site onto the shared builder cannot change what users receive.
    const ids = ['HBM1.AAAA.111', 'HBM2.BBBB.222'];
    expect(buildWholeDatasetManifest(ids)).toBe(`${ids.join(' /\n')} /`);
  });

  test('handles a single dataset', () => {
    expect(buildWholeDatasetManifest(['HBM1.AAAA.111'])).toBe('HBM1.AAAA.111 /');
  });

  test('handles an empty list', () => {
    expect(buildWholeDatasetManifest([])).toBe('');
  });
});
