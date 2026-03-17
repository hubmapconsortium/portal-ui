import LZString from 'lz-string';
import {
  encodeHierarchical,
  decodeHierarchical,
  isLegacyCompressedURL,
  parseReadableParams,
  READABLE_PARAM_FIELDS,
} from './searchParams';
import { parseURLState } from './store';

// A real LZString-compressed legacy URL fixture encoding:
// { organ: ['Kidney', 'Liver'], raw_dataset_type: { CODEX: ['CODEX [Akoya Polaris]'] } }
const LEGACY_COMPRESSED_BLOB =
  'N4IgzgpghgTgxgCxALhCANOA9jALgMQEsIAbAExVADNjyUQSoxcB9AWyzMJojJd0JsIzKGwAOGEFxgQ4ArADt6ZYXBABfTDRK4IMMJRA5CAc0IKWYUWJLCWAVwWEAjvYjsoYsbxY4TUBQNkUFwAT296ABUAUQAlAFlJADcoEjcggG0QAGlCMgUIUMkAGUIkvRAAXU0QGCgAdxYyKFwmCFYwiOCQToh6AAkASTiAQViAYSHxkeLk1PTDcYB5ABFogA0ULOW19YACDJGAayxQqD2ABSxGGEIwSqr1J-UgA';

const LEGACY_COMPRESSED_STATE = {
  search: '',
  sortField: { field: 'last_modified_timestamp', direction: 'desc' },
  filters: {
    origin_samples_unique_mapped_organs: { type: 'TERM', values: ['Kidney', 'Liver'] },
    raw_dataset_type: { type: 'HIERARCHICAL', values: { CODEX: ['CODEX [Akoya Polaris]'] } },
  },
};

describe('encodeHierarchical', () => {
  test('encodes each child as parent.child', () => {
    const result = encodeHierarchical({ CODEX: new Set(['assay1', 'assay2']) });
    expect(result).toEqual(expect.arrayContaining(['CODEX.assay1', 'CODEX.assay2']));
    expect(result).toHaveLength(2);
  });

  test('encodes a parent with no children as parent-only', () => {
    expect(encodeHierarchical({ CODEX: new Set([]) })).toEqual(['CODEX']);
  });

  test('handles multiple parents', () => {
    const result = encodeHierarchical({
      CODEX: new Set(['child1']),
      'snRNA-seq': new Set(['child2', 'child3']),
    });
    expect(result).toEqual(expect.arrayContaining(['CODEX.child1', 'snRNA-seq.child2', 'snRNA-seq.child3']));
    expect(result).toHaveLength(3);
  });
});

describe('decodeHierarchical', () => {
  test('decodes dot-notation values back to parent → children map', () => {
    expect(decodeHierarchical(['CODEX.assay1', 'CODEX.assay2'])).toEqual({ CODEX: ['assay1', 'assay2'] });
  });

  test('decodes parent-only value to empty children array', () => {
    expect(decodeHierarchical(['CODEX'])).toEqual({ CODEX: [] });
  });

  test('groups multiple children under the same parent', () => {
    const result = decodeHierarchical(['snRNA-seq.child1', 'snRNA-seq.child2', 'CODEX.child3']);
    expect(result).toEqual({ 'snRNA-seq': ['child1', 'child2'], CODEX: ['child3'] });
  });
});

describe('encodeHierarchical / decodeHierarchical round-trip', () => {
  test('round-trips a typical hierarchical filter', () => {
    const original: Record<string, Set<string>> = {
      CODEX: new Set(['CODEX [Akoya Polaris]', 'CODEX [Akoya CODEX]']),
      'snRNA-seq': new Set(['snRNA-seq [10x Chromium v3]']),
    };
    const encoded = encodeHierarchical(original);
    const decoded = decodeHierarchical(encoded);
    // Convert back to Set form for comparison
    const roundTripped = Object.fromEntries(Object.entries(decoded).map(([k, v]) => [k, new Set(v)]));
    expect(roundTripped).toEqual(original);
  });
});

describe('isLegacyCompressedURL', () => {
  test('returns true for a real LZString-compressed blob (no = sign)', () => {
    expect(isLegacyCompressedURL(`?${LEGACY_COMPRESSED_BLOB}`)).toBe(true);
  });

  test('returns false for a new-format query string with named params', () => {
    expect(isLegacyCompressedURL('?organ=Kidney&organ=Liver')).toBe(false);
  });

  test('returns false for a query string with a q param', () => {
    expect(isLegacyCompressedURL('?dataset_type=CODEX&q=abc123')).toBe(false);
  });

  test('returns false for an empty search string', () => {
    expect(isLegacyCompressedURL('')).toBe(false);
    expect(isLegacyCompressedURL('?')).toBe(false);
  });
});

describe('parseReadableParams', () => {
  test('parses organ TERM filter from named params', () => {
    const result = parseReadableParams('?organ=Kidney&organ=Liver');
    expect(result.filters?.['origin_samples_unique_mapped_organs']).toEqual({
      type: 'TERM',
      values: ['Kidney', 'Liver'],
    });
  });

  test('parses analyte TERM filter', () => {
    const result = parseReadableParams('?analyte=RNA');
    expect(result.filters?.['analyte_class']).toEqual({ type: 'TERM', values: ['RNA'] });
  });

  test('parses dataset_type HIERARCHICAL filter with dot-notation', () => {
    const result = parseReadableParams('?dataset_type=CODEX.child1&dataset_type=CODEX.child2');
    expect(result.filters?.['raw_dataset_type']).toEqual({
      type: 'HIERARCHICAL',
      values: { CODEX: ['child1', 'child2'] },
    });
  });

  test('parses status HIERARCHICAL filter with dot-notation', () => {
    const result = parseReadableParams('?status=Published.Public');
    expect(result.filters?.['mapped_status']).toEqual({
      type: 'HIERARCHICAL',
      values: { Published: ['Public'] },
    });
  });

  test('parses compressed q param and merges with named params', () => {
    const remaining = { search: 'myquery', sortField: { field: 'created_timestamp', direction: 'asc' }, filters: {} };
    const q = LZString.compressToEncodedURIComponent(JSON.stringify(remaining));
    const result = parseReadableParams(`?organ=Kidney&q=${q}`);
    expect(result.search).toBe('myquery');
    expect(result.sortField).toEqual({ field: 'created_timestamp', direction: 'asc' });
    expect(result.filters?.['origin_samples_unique_mapped_organs']).toEqual({ type: 'TERM', values: ['Kidney'] });
  });

  test('returns empty object for empty search string', () => {
    const result = parseReadableParams('');
    expect(result).toEqual({ filters: {} });
  });

  test('readable params take precedence over same field in q', () => {
    // q contains organ filter, but named param should win
    const qState = {
      filters: { origin_samples_unique_mapped_organs: { type: 'TERM', values: ['Brain'] } },
    };
    const q = LZString.compressToEncodedURIComponent(JSON.stringify(qState));
    const result = parseReadableParams(`?organ=Kidney&q=${q}`);
    expect(result.filters?.['origin_samples_unique_mapped_organs']).toEqual({ type: 'TERM', values: ['Kidney'] });
  });
});

describe('backward compatibility: legacy compressed URLs', () => {
  test('LEGACY_COMPRESSED_BLOB round-trips through LZString', () => {
    const decompressed = LZString.decompressFromEncodedURIComponent(LEGACY_COMPRESSED_BLOB);
    expect(decompressed).toBeTruthy();
    const parsed: unknown = JSON.parse(decompressed);
    expect(parsed).toEqual(LEGACY_COMPRESSED_STATE);
  });

  test('isLegacyCompressedURL correctly identifies the legacy fixture', () => {
    expect(isLegacyCompressedURL(`?${LEGACY_COMPRESSED_BLOB}`)).toBe(true);
  });

  test('parseURLState correctly deserializes the legacy fixture via LZString', () => {
    const decompressed = LZString.decompressFromEncodedURIComponent(LEGACY_COMPRESSED_BLOB);
    const result = parseURLState(decompressed);
    expect(result.filters?.['origin_samples_unique_mapped_organs']).toEqual({
      type: 'TERM',
      values: ['Kidney', 'Liver'],
    });
    expect(result.filters?.['raw_dataset_type']).toEqual({
      type: 'HIERARCHICAL',
      values: { CODEX: ['CODEX [Akoya Polaris]'] },
    });
    expect(result.sortField).toEqual({ field: 'last_modified_timestamp', direction: 'desc' });
  });

  test('READABLE_PARAM_FIELDS maps the 4 important facets', () => {
    expect(READABLE_PARAM_FIELDS).toMatchObject({
      origin_samples_unique_mapped_organs: 'organ',
      analyte_class: 'analyte',
      raw_dataset_type: 'dataset_type',
      mapped_status: 'status',
    });
  });
});
