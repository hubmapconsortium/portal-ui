import { paths } from 'js/components/entity-search/SearchWrapper/metadataDocumentPaths';
import { getFieldFromHitFields } from './utils';

const datasetSamplePath = paths.dataset.sample;

test('returns nested non source_sample fields', () => {
  const hitFields = {
    a: { b: 'c' },
  };
  expect(getFieldFromHitFields(hitFields, 'a.b')).toBe('c');
});

test('returns metadata field from source_sample', () => {
  const hitFields = {
    a: { b: 'c' },
    source_samples: [{ metadata: { animal: 'cat' } }],
  };
  expect(getFieldFromHitFields(hitFields, `${datasetSamplePath}.animal`)).toBe('cat');
});

test('returns undefined if source_sample does not exist', () => {
  const hitFields = {
    a: { b: 'c' },
  };
  expect(getFieldFromHitFields(hitFields, `${datasetSamplePath}.fruit`)).toBeUndefined();
});

test('returns undefined if source_sample exists, but the field does not', () => {
  const hitFields = {
    a: { b: 'c' },
    source_samples: [{ metadata: { animal: 'cat' } }],
  };
  expect(getFieldFromHitFields(hitFields, `${datasetSamplePath}.fruit`)).toBeUndefined();
});
