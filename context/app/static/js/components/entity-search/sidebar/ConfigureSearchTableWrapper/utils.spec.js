import { filterFieldConfigs, getFieldEntriesSortedByConfigureGroup } from './utils';

test('getFieldEntriesSortedByConfigureGroup should sort by configure group with general on type then alphabetically then field name alphabetically', () => {
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

test('filterFieldConfigs should remove field configs with date or datetime types', () => {
  const fieldConfigEntries = [
    ['start_date', { type: 'date', label: 'start date' }],
    ['name', { type: 'string', label: 'name' }],
    ['end_date', { type: 'datetime', label: 'end date' }],
  ];
  expect(filterFieldConfigs(fieldConfigEntries, '')).toEqual([['name', { type: 'string', label: 'name' }]]);
});

test("filterFieldConfigs should remove field configs with labels which don't include the provided search bar text", () => {
  const fieldConfigEntries = [
    ['name', { type: 'string', label: 'name' }],
    ['group', { type: 'string', label: 'group' }],
  ];
  expect(filterFieldConfigs(fieldConfigEntries, 'am')).toEqual([['name', { type: 'string', label: 'name' }]]);
});
