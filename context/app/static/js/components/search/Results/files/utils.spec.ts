import { getOrganLabels, FileDocument } from './utils';

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
