import { buildQuery, GROUP_COUNT_AGG } from './utils';
import { FACETS } from './store';
import { Mappings } from './useEsMapping';

// Shaped after the real files index mapping: note the absence of `uuid` and `all_text`.
const filesMappings: Mappings = {
  mappings: {
    properties: {
      dataset_uuid: { fields: { keyword: { type: 'keyword' } } },
      dataset_hubmap_id: { fields: { keyword: { type: 'keyword' } } },
      rel_path: { fields: { keyword: { type: 'keyword' } } },
      file_extension: { fields: { keyword: { type: 'keyword' } } },
      dataset_type: { fields: { keyword: { type: 'keyword' } } },
      size: { type: 'long' },
    },
  },
};

const baseArgs = {
  facets: {
    file_extension: { field: 'file_extension', type: FACETS.term },
  },
  search: '',
  size: 18,
  searchFields: ['rel_path'],
  sourceFields: { table: ['rel_path'] },
  sortField: { field: 'dataset_uuid', direction: 'desc' as const },
  mappings: filesMappings,
};

const extensionFilter = {
  file_extension: { type: FACETS.term, values: new Set(['.h5ad']) },
};

type Built = {
  sort: Record<string, unknown>[];
  query: { bool: { must: unknown[] } };
  post_filter?: unknown;
  collapse?: { field: string; inner_hits: Record<string, unknown> };
  // Request-side shape: a filter aggregation nests children under `aggs`. (The ES *response*
  // flattens sub-aggregations directly under the parent, which is what `getGroupCount` reads.)
  aggs?: Record<
    string,
    {
      filter?: unknown;
      aggs?: Record<string, { cardinality?: { field: string; precision_threshold: number } }>;
    }
  >;
};

function build(overrides: Record<string, unknown>) {
  const result = buildQuery({ filters: {}, buildAggregations: false, ...baseArgs, ...overrides });
  if (!result) throw new Error('buildQuery returned null');
  return result as unknown as Built;
}

describe('buildQuery uniqueSortField', () => {
  test('defaults to uuid.keyword, preserving behaviour for the entity searches', () => {
    const sort = build({}).sort;
    expect(JSON.stringify(sort)).toContain('uuid.keyword');
  });

  test('an override replaces the tiebreaker, so no unmapped field is sorted on', () => {
    // Sorting on a field absent from the mapping is a hard ES error, so the files search
    // must not emit `uuid.keyword` anywhere.
    const serialized = JSON.stringify(build({ uniqueSortField: 'dataset_uuid.keyword' }).sort);

    expect(serialized).toContain('dataset_uuid.keyword');
    expect(serialized).not.toContain('"uuid.keyword"');
  });
});

describe('buildQuery filterMode', () => {
  test('post_filter (the default) keeps filters out of the main query', () => {
    const built = build({ filters: extensionFilter });

    expect(JSON.stringify(built.post_filter)).toContain('.h5ad');
    expect(JSON.stringify(built.query)).not.toContain('.h5ad');
  });

  test("'query' moves filters into the main query and emits no post_filter", () => {
    // This is what makes `inner_hits` respect the active facets: they honour the main
    // query but ignore post_filter.
    const built = build({ filters: extensionFilter, filterMode: 'query' });

    expect(JSON.stringify(built.query)).toContain('.h5ad');
    expect(built.post_filter).toBeUndefined();
  });

  test("'query' keeps the free-text clause alongside the filters", () => {
    const built = build({ filters: extensionFilter, search: 'expression', filterMode: 'query' });
    const serialized = JSON.stringify(built.query);

    expect(serialized).toContain('expression');
    expect(serialized).toContain('.h5ad');
  });
});

describe('buildQuery collapse', () => {
  test('is absent unless configured', () => {
    expect(build({}).collapse).toBeUndefined();
  });

  test('emits the collapse field and inner_hits, resolving the keyword subfield', () => {
    const built = build({
      collapse: {
        field: 'dataset_uuid',
        innerHits: { name: 'files', size: 20, sort: { field: 'rel_path', direction: 'asc' as const } },
      },
    });

    expect(built.collapse?.field).toBe('dataset_uuid.keyword');
    expect(built.collapse?.inner_hits).toMatchObject({ name: 'files', size: 20 });
    expect(JSON.stringify(built.collapse?.inner_hits)).toContain('rel_path.keyword');
  });
});

describe('buildQuery group count aggregation', () => {
  test('is absent unless a groupCountField is given', () => {
    const built = build({ buildAggregations: true });
    expect(built.aggs?.[GROUP_COUNT_AGG]).toBeUndefined();
  });

  test('counts distinct groups with an exact precision threshold', () => {
    const built = build({ buildAggregations: true, groupCountField: 'dataset_uuid' });
    const inner = built.aggs?.[GROUP_COUNT_AGG]?.aggs?.[GROUP_COUNT_AGG];

    expect(inner?.cardinality?.field).toBe('dataset_uuid.keyword');
    // Above the number of datasets, so `cardinality` reports an exact count rather than an
    // estimate; the default threshold of 3000 is below it and would be approximate.
    expect(inner?.cardinality?.precision_threshold).toBe(40000);
  });

  test('applies every active filter, since it reports the current result count', () => {
    const built = build({
      buildAggregations: true,
      groupCountField: 'dataset_uuid',
      filters: extensionFilter,
    });
    // Contrast with the facet aggregations, which exclude their own filter to keep
    // multi-select counts meaningful.
    expect(JSON.stringify(built.aggs?.[GROUP_COUNT_AGG])).toContain('.h5ad');
  });
});
