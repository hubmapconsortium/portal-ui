import { getOrganLabels, stripPipelineSuffix, FileDocument } from './utils';

describe('getOrganLabels', () => {
  test('deduplicates, since a dataset can repeat an organ across entries', () => {
    const source: FileDocument = {
      dataset_uuid: 'u',
      dataset_hubmap_id: 'H',
      rel_path: 'a',
      organs: [{ label: 'Spleen' }, { label: 'Spleen' }, { label: 'Thymus' }, {}],
    };
    expect(getOrganLabels(source)).toEqual(['Spleen', 'Thymus']);
  });

  test('returns an empty list when there are no organs', () => {
    expect(getOrganLabels({ dataset_uuid: 'u', dataset_hubmap_id: 'H', rel_path: 'a' })).toEqual([]);
    expect(getOrganLabels(undefined)).toEqual([]);
  });
});

describe('stripPipelineSuffix', () => {
  test("drops the pipeline suffix, reproducing the portal index's raw_dataset_type", () => {
    expect(stripPipelineSuffix('RNAseq [Salmon]')).toBe('RNAseq');
    expect(stripPipelineSuffix('10X Multiome [Salmon + ArchR + Muon]')).toBe('10X Multiome');
    expect(stripPipelineSuffix('Histology [Kaggle-1 Segmentation]')).toBe('Histology');
    expect(stripPipelineSuffix('Publication [ancillary]')).toBe('Publication');
  });

  test('leaves a bare dataset type alone', () => {
    expect(stripPipelineSuffix('RNAseq')).toBe('RNAseq');
    expect(stripPipelineSuffix('2D Imaging Mass Cytometry')).toBe('2D Imaging Mass Cytometry');
  });

  test('keeps parenthesised qualifiers, which are part of the raw type', () => {
    // `Visium (no probes)` is its own `raw_dataset_type`; only the bracketed pipeline is a suffix.
    expect(stripPipelineSuffix('Visium (no probes) [Salmon + Scanpy]')).toBe('Visium (no probes)');
    expect(stripPipelineSuffix('Visium (no probes)')).toBe('Visium (no probes)');
  });
});
