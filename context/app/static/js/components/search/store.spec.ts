import { buildSearchLink } from './store';
import { parseReadableParams } from './searchParams';
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
