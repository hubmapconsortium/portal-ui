import { getMetadataFieldsSortedByEntityTypeThenFieldName } from './utils';

test('should sort by entity type then field name', () => {
  const map = {
    vital_state: 'sample',
    assay_type: 'dataset',
    sex: 'donor',
    description: 'dataset',
    blood_type: 'donor',
  };

  expect(getMetadataFieldsSortedByEntityTypeThenFieldName(map)).toEqual([
    { fieldName: 'assay_type', fieldEntityType: 'dataset' },
    { fieldName: 'description', fieldEntityType: 'dataset' },
    { fieldName: 'blood_type', fieldEntityType: 'donor' },
    { fieldName: 'sex', fieldEntityType: 'donor' },
    { fieldName: 'vital_state', fieldEntityType: 'sample' },
  ]);
});
