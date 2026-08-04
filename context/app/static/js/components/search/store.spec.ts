import history from 'history/browser';
import { buildSearchLink, createStore } from './store';
import type { SearchStoreState } from './store';
import { DATASET_FEATURES_FIELD, parseReadableParams } from './searchParams';
import { getSearchURL } from '../organ/utils';

describe('buildSearchLink dataProductID', () => {
  test('encodes a data product ID as a readable param (not the opaque q blob)', () => {
    const link = buildSearchLink({ entity_type: 'Dataset', dataProductID: 'dp-123' });
    expect(link.startsWith('/search/datasets?')).toBe(true);
    expect(link).toContain('data_product=dp-123');
    expect(link).not.toContain('q=');
  });

  test('round-trips a data product ID through build → parse', () => {
    const link = buildSearchLink({ entity_type: 'Dataset', dataProductID: 'dp-123' });
    const parsed = parseReadableParams(link.slice(link.indexOf('?')));
    expect(parsed.dataProductID).toBe('dp-123');
  });

  test('does not include any params when no filters, scFind params, or data product ID are present', () => {
    expect(buildSearchLink({ entity_type: 'Dataset' })).toBe('/search/datasets');
  });

  test('stays compact regardless of how many datasets the product represents', () => {
    // The motivating bug: embedding every dataset UUID produced URLs long enough to trigger
    // browser warnings. A data-product link references a single short ID instead.
    const manyUUIDs = Array.from({ length: 75 }, (_, i) => `00000000-0000-0000-0000-${String(i).padStart(12, '0')}`);
    const uuidLink = buildSearchLink({
      entity_type: 'Dataset',
      filters: { uuid: { type: 'TERM', values: manyUUIDs } },
    });
    const dataProductLink = buildSearchLink({ entity_type: 'Dataset', dataProductID: 'dp-123' });

    expect(dataProductLink.length).toBeLessThan(uuidLink.length);
  });
});

describe('buildSearchLink scFindParams', () => {
  test('encodes a scFind-only flag as a readable param', () => {
    const link = buildSearchLink({ entity_type: 'Dataset', scFindParams: { scFindOnly: true } });
    expect(link).toContain('scfind=true');
    expect(link).not.toContain('q=');
    expect(parseReadableParams(link.slice(link.indexOf('?'))).scFindParams).toEqual({ scFindOnly: true });
  });

  test('round-trips genes as readable params', () => {
    const link = buildSearchLink({ entity_type: 'Dataset', scFindParams: { genes: ['CD4', 'CD8A'] } });
    expect(link).toContain('genes=CD4');
    expect(link).toContain('genes=CD8A');
    expect(parseReadableParams(link.slice(link.indexOf('?'))).scFindParams).toEqual({ genes: ['CD4', 'CD8A'] });
  });

  test('round-trips cell types containing commas via repeated params', () => {
    // CL labels such as "CD4-positive, alpha-beta T cell" contain commas, which must not be
    // split apart by the comma-separated readable-param parsing.
    const cellTypes = ['Kidney.CD4-positive, alpha-beta T cell', 'Liver.podocyte'];
    const link = buildSearchLink({ entity_type: 'Dataset', scFindParams: { cellTypes } });
    expect(parseReadableParams(link.slice(link.indexOf('?'))).scFindParams).toEqual({ cellTypes });
  });

  test('combines scFind genes with readable organ filters', () => {
    const link = buildSearchLink({
      entity_type: 'Dataset',
      scFindParams: { genes: ['CD4'] },
      filters: { origin_samples_unique_mapped_organs: { type: 'TERM', values: ['Kidney'] } },
    });
    const parsed = parseReadableParams(link.slice(link.indexOf('?')));
    expect(parsed.scFindParams).toEqual({ genes: ['CD4'] });
    expect(parsed.filters?.['origin_samples_unique_mapped_organs']).toEqual({ type: 'TERM', values: ['Kidney'] });
  });
});

describe('buildSearchLink dataset features', () => {
  const visualizationFeature = { type: 'BOOLEAN_GROUP' as const, values: ['visualization::true'] };
  const visualizationFilter = { [DATASET_FEATURES_FIELD]: visualizationFeature };

  test('encodes the visualization feature as a readable param (not the opaque q blob)', () => {
    // Regression: the home page "View Visualizations" CTA previously hardcoded a hand-authored q
    // blob whose `values` was a `Set("…")` string, which failed zod validation and silently
    // discarded the entire URL state, landing on an unfiltered search page.
    const link = buildSearchLink({ entity_type: 'Dataset', filters: visualizationFilter });
    expect(link).toBe('/search/datasets?visualization=true');
  });

  test('round-trips the visualization feature through build → parse', () => {
    const link = buildSearchLink({ entity_type: 'Dataset', filters: visualizationFilter });
    expect(parseReadableParams(link.slice(link.indexOf('?'))).filters?.[DATASET_FEATURES_FIELD]).toEqual(
      visualizationFeature,
    );
  });

  test('round-trips multiple features alongside a readable organ filter', () => {
    const filters = {
      [DATASET_FEATURES_FIELD]: { type: 'BOOLEAN_GROUP' as const, values: ['visualization::true', 'spatial'] },
      origin_samples_unique_mapped_organs: { type: 'TERM' as const, values: ['Kidney'] },
    };
    const link = buildSearchLink({ entity_type: 'Dataset', filters });
    expect(link).not.toContain('q=');
    const parsed = parseReadableParams(link.slice(link.indexOf('?')));
    expect(parsed.filters?.['_dataset_features']?.values).toEqual(
      expect.arrayContaining(['visualization::true', 'spatial']),
    );
    expect(parsed.filters?.['origin_samples_unique_mapped_organs']).toEqual({ type: 'TERM', values: ['Kidney'] });
  });

  test('falls back to the q blob for an item key with no readable param', () => {
    const link = buildSearchLink({
      entity_type: 'Dataset',
      filters: {
        [DATASET_FEATURES_FIELD]: { type: 'BOOLEAN_GROUP', values: ['visualization::true', 'some_future_item'] },
      },
    });
    expect(link).toContain('visualization=true');
    expect(link).toContain('q=');
    expect(parseReadableParams(link.slice(link.indexOf('?'))).filters?.['_dataset_features']?.values).toEqual(
      expect.arrayContaining(['visualization::true', 'some_future_item']),
    );
  });
});

describe('replaceURLSearchParams', () => {
  const initialState: SearchStoreState = {
    search: '',
    filters: {
      [DATASET_FEATURES_FIELD]: { type: 'BOOLEAN_GROUP', values: new Set<string>() },
      origin_samples_unique_mapped_organs: { type: 'TERM', values: new Set<string>() },
    },
    initialFilters: {},
    facets: {},
    searchFields: ['all_text'],
    sortField: { field: 'last_modified_timestamp', direction: 'desc' },
    sourceFields: { table: ['hubmap_id'] },
    view: 'table',
    size: 18,
    endpoint: 'http://example.com/search',
    type: 'Dataset',
    analyticsCategory: 'Datasets Search Page Interactions',
    includeSupersededEntities: false,
  };

  function toggleVisualization() {
    const store = createStore({ initialState });
    store.getState().filterBooleanGroupItem({ field: DATASET_FEATURES_FIELD, itemKey: 'visualization::true' });
    return store;
  }

  test('writes a checked dataset feature as a readable param, with no q blob', () => {
    history.replace('/search/datasets');
    toggleVisualization();

    const params = new URLSearchParams(history.location.search);
    expect(params.get('visualization')).toBe('true');
    expect(params.get('q')).toBeNull();
  });

  test('preserves params the search state does not own', () => {
    // Regression: the query string is rebuilt from scratch on every filter change, which used to
    // destroy unrelated params — `mode=say-see` vanished on the first facet interaction.
    history.replace('/search/datasets?mode=say-see');
    toggleVisualization();

    expect(new URLSearchParams(history.location.search).get('mode')).toBe('say-see');
  });

  test('clears its own params when a filter is unchecked, without touching unowned params', () => {
    history.replace('/search/datasets?mode=say-see');
    const store = toggleVisualization();
    store.getState().filterBooleanGroupItem({ field: DATASET_FEATURES_FIELD, itemKey: 'visualization::true' });

    const params = new URLSearchParams(history.location.search);
    expect(params.get('visualization')).toBeNull();
    expect(params.get('mode')).toBe('say-see');
  });
});

describe('getSearchURL', () => {
  test('builds a dataset search link from a data product ID', () => {
    const link = getSearchURL({ entityType: 'Dataset', dataProductID: 'dp-abc' });
    expect(parseReadableParams(link.slice(link.indexOf('?'))).dataProductID).toBe('dp-abc');
  });

  test('builds a dataset search link from scFind cell types', () => {
    const link = getSearchURL({ entityType: 'Dataset', scFindParams: { cellTypes: ['Kidney.podocyte'] } });
    expect(parseReadableParams(link.slice(link.indexOf('?'))).scFindParams).toEqual({
      cellTypes: ['Kidney.podocyte'],
    });
  });
});
