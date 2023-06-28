import { countPublicationAggs } from './utils';

const aggsBuckets = [
  { doc_count: 5, key_as_string: 'false' },
  { doc_count: 10, key_as_string: 'true' },
];

describe('countPublicationAggs', () => {
  test('should provide counts for expected buckets', () => {
    expect(countPublicationAggs(aggsBuckets)).toEqual({
      statuses: { true: { category: 'Peer Reviewed', count: 10 }, false: { category: 'Preprint', count: 5 } },
      publicationsCount: 15,
    });
  });

  test('should ignore counts for unexpected buckets', () => {
    expect(countPublicationAggs([...aggsBuckets, { doc_count: 20, key_as_string: 'geodude' }])).toEqual({
      statuses: { true: { category: 'Peer Reviewed', count: 10 }, false: { category: 'Preprint', count: 5 } },
      publicationsCount: 15,
    });
  });
});
