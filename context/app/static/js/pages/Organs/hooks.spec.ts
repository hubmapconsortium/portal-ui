import { OrganFile } from 'js/components/organ/types';
import { buildOrganToCountMap, addSearchTermsCount, addCountsToOrgans, organNotFoundMessageTemplate } from './hooks';

interface TermsBucket {
  key: string;
  doc_count: number;
}

const mockAggsBuckets: TermsBucket[] = [
  { key: 'A1', doc_count: 5 },
  { key: 'A2', doc_count: 7 },
  { key: 'B', doc_count: 10 },
];

test('should convert aggs buckets to map', () => {
  expect(buildOrganToCountMap(mockAggsBuckets)).toEqual({ A1: 5, A2: 7, B: 10 });
});

test('should sum counts for search terms groups', () => {
  expect(addSearchTermsCount(['A1', 'A2'], { A1: 5, A2: 7, B: 10 })).toBe(12);
});

test('should add dataset counts to organ objects', () => {
  const mockOrgans: Record<string, OrganFile> = {
    A: {
      search: ['A1', 'A2'],
      asctb: '',
      description: '',
      has_iu_component: false,
      icon: '',
      name: 'A',
      uberon: '',
      uberon_short: '',
    },
    B: {
      search: ['B'],
      asctb: '',
      description: '',
      has_iu_component: false,
      icon: '',
      name: 'B',
      uberon: '',
      uberon_short: '',
    },
  };

  expect(addCountsToOrgans(mockOrgans, mockAggsBuckets, mockAggsBuckets)).toEqual({
    A: {
      search: ['A1', 'A2'],
      asctb: '',
      description: '',
      has_iu_component: false,
      icon: '',
      name: 'A',
      uberon: '',
      uberon_short: '',
      descendantCounts: { Dataset: 12, Sample: 12 },
    },
    B: {
      search: ['B'],
      asctb: '',
      description: '',
      has_iu_component: false,
      icon: '',
      name: 'B',
      uberon: '',
      uberon_short: '',
      descendantCounts: { Dataset: 10, Sample: 10 },
    },
  });
});

test('organNotFoundMessageTemplate should format the passed organ string into an error message', () => {
  expect(organNotFoundMessageTemplate('A')).toBe(
    'The organ "A" was not found. You have been redirected to the list of available organs.',
  );
});
