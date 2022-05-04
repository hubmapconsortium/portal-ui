import { getFieldEntriesSortedByConfigureGroup } from './utils';

test('should sort by configure group with general on type then alphabetically then field name alphabetically', () => {
  const map = {
    assay_type: { label: 'assay_type', configureGroup: 'Dataset Metadata' },
    description: { label: 'description', configureGroup: 'Dataset Metadata' },
    blood_type: { label: 'blood_type', configureGroup: 'Donor Metadata' },
    date: { label: 'date', configureGroup: 'General' },
    sex: { label: 'sex', configureGroup: 'Donor Metadata' },
    vital_state: { label: 'vital_state', configureGroup: 'Sample Metadata' },
    id: { label: 'id', configureGroup: 'General' },
  };

  expect(getFieldEntriesSortedByConfigureGroup(map)).toEqual([
    ['date', { label: 'date', configureGroup: 'General' }],
    ['id', { label: 'id', configureGroup: 'General' }],
    ['assay_type', { label: 'assay_type', configureGroup: 'Dataset Metadata' }],
    ['description', { label: 'description', configureGroup: 'Dataset Metadata' }],
    ['blood_type', { label: 'blood_type', configureGroup: 'Donor Metadata' }],
    ['sex', { label: 'sex', configureGroup: 'Donor Metadata' }],
    ['vital_state', { label: 'vital_state', configureGroup: 'Sample Metadata' }],
  ]);
});
