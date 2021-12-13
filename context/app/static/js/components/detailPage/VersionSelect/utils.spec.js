import { getCleanVersion } from './utils';

test('should rename dataset_uuid key to uuid and preserve other key names', () => {
  const version = {
    dataset_uuid: 'apple',
    revision_number: 3,
  };

  expect(getCleanVersion(version)).toEqual({ uuid: 'apple', revision_number: 3 });
});
