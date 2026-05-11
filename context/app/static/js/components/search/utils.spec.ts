import esb from 'elastic-builder';
import { buildQuery } from './utils';
import { Mappings } from './useEsMapping';

const mappings: Mappings = {
  mappings: {
    properties: {
      uuid: { fields: { keyword: { type: 'keyword' } } },
      hubmap_id: { fields: { keyword: { type: 'keyword' } } },
      entity_type: { fields: { keyword: { type: 'keyword' } } },
      all_text: { type: 'text' },
      last_modified_timestamp: { type: 'date' },
    },
  },
};

const defaultQuery = esb.boolQuery().must([esb.termsQuery('entity_type.keyword', ['Dataset'])]);
const latestRevisionFilter = esb
  .boolQuery()
  .mustNot([esb.existsQuery('next_revision_uuid'), esb.existsQuery('sub_status')]);

function run(search: string) {
  return buildQuery({
    filters: {},
    facets: {},
    search,
    size: 18,
    searchFields: ['all_text'],
    sourceFields: { table: ['hubmap_id'] },
    sortField: { field: 'last_modified_timestamp', direction: 'desc' },
    defaultQuery,
    latestRevisionFilter,
    mappings,
    buildAggregations: false,
  }) as { query: { bool: { must: unknown[] } } } | null;
}

function mustOf(result: ReturnType<typeof run>): string {
  if (!result) throw new Error('buildQuery returned null');
  return JSON.stringify(result.query.bool.must);
}

describe('buildQuery HuBMAP-ID lookup handling', () => {
  test('free-text search keeps the latestRevisionFilter and targets all_text', () => {
    const serialized = mustOf(run('kidney atlas'));

    expect(serialized).toContain('next_revision_uuid');
    expect(serialized).toContain('simple_query_string');
    expect(serialized).toContain('all_text');
    expect(serialized).toContain('kidney atlas');
  });

  test('wildcard HuBMAP-ID search drops the latestRevisionFilter and targets hubmap_id', () => {
    const serialized = mustOf(run('*676*'));

    expect(serialized).not.toContain('next_revision_uuid');
    expect(serialized).toContain('wildcard');
    expect(serialized).toContain('hubmap_id');
    expect(serialized).toContain('*676*');
  });

  test('quoted HBM-ID search drops the latestRevisionFilter', () => {
    const serialized = mustOf(run('"HBM123.ABCD.456"'));

    expect(serialized).not.toContain('next_revision_uuid');
    expect(serialized).toContain('simple_query_string');
    expect(serialized).toContain('all_text');
    expect(serialized).toContain('HBM123.ABCD.456');
  });

  test('empty search keeps the latestRevisionFilter', () => {
    const serialized = mustOf(run(''));

    expect(serialized).toContain('next_revision_uuid');
  });
});
