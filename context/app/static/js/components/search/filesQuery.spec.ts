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

  test('emits no inner_hits when none is configured', () => {
    // Load-bearing for performance: requesting the grouped documents takes the same query from
    // ~215ms to ~12.7s against the files index.
    const built = build({ collapse: { field: 'dataset_uuid' } });

    expect(built.collapse?.field).toBe('dataset_uuid.keyword');
    expect(built.collapse?.inner_hits).toBeUndefined();
  });

  test('emits inner_hits when explicitly configured, resolving the keyword subfield', () => {
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

describe('buildQuery filenameFilter', () => {
  test('is absent unless set', () => {
    expect(JSON.stringify(build({}).query)).not.toContain('wildcard');
  });

  test('emits a case-insensitive contains wildcard on the keyword subfield', () => {
    // A wildcard rather than a text match because the analyzed path field tokenizes into whole path
    // segments: "secondary" does not match `secondary_analysis.h5ad`, only the full segment does.
    const serialized = JSON.stringify(build({ filenameFilter: 'expr' }).query);

    expect(serialized).toContain('wildcard');
    expect(serialized).toContain('rel_path.keyword');
    expect(serialized).toContain('*expr*');
    expect(serialized).toContain('case_insensitive');
  });

  test('targets an overridden field', () => {
    const serialized = JSON.stringify(build({ filenameFilter: 'expr', filenameField: 'dataset_type' }).query);
    expect(serialized).toContain('dataset_type.keyword');
  });

  test('survives filterMode: query alongside the other filters', () => {
    // `filterMode: 'query'` rebuilds the bool query, so the filename clause has to be re-listed
    // there or it would be silently dropped exactly when collapsing is in use.
    const serialized = JSON.stringify(
      build({ filenameFilter: 'expr', filters: extensionFilter, filterMode: 'query' }).query,
    );

    expect(serialized).toContain('*expr*');
    expect(serialized).toContain('.h5ad');
  });

  test('coexists with a free-text search', () => {
    const serialized = JSON.stringify(build({ filenameFilter: 'expr', search: 'kidney' }).query);
    expect(serialized).toContain('*expr*');
    expect(serialized).toContain('kidney');
  });
});

describe('buildQuery ID lookup fields', () => {
  test('a HuBMAP-ID-shaped term targets the configured ID field', () => {
    // An unmapped field in a *query* matches nothing silently (only `sort` errors), so pointing this
    // at `hubmap_id` on an index that only has `dataset_hubmap_id` would return zero results with no
    // indication why.
    const serialized = JSON.stringify(build({ search: 'HBM123.ABCD.456', hubmapIdField: 'dataset_hubmap_id' }).query);
    expect(serialized).toContain('dataset_hubmap_id.keyword');
    expect(serialized).not.toContain('"hubmap_id.keyword"');
  });

  test('a UUID-shaped term targets the configured uuid field', () => {
    const serialized = JSON.stringify(build({ search: 'a'.repeat(32), uuidField: 'dataset_uuid' }).query);
    expect(serialized).toContain('dataset_uuid.keyword');
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
