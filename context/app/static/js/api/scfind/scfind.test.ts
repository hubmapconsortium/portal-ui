import { createFindDatasetForCellTypeKey } from './useFindDatasetForCellTypes';
import {
  cellTypeNameContainsComma,
  createScFindKey,
  createScFindPostRequest,
  extractCellTypeInfo,
  extractCellTypesInfo,
  formatCellTypeName,
} from './utils';

const scFindEndpoint = 'http://example.com';

describe('createScfindKey', () => {
  function expectURLIsValid(key: string) {
    expect(() => new URL(key)).not.toThrow();
  }

  it('should use the appropriate scfind base URL', () => {
    const key = createScFindKey(scFindEndpoint, 'endpoint', {});
    expect(key).toContain(scFindEndpoint);
    expectURLIsValid(key);
  });

  it.each(['endpoint1', 'endpoint2', 'endpoint3', 'my-weird-endpoint'])(
    'should use the appropriate provided endpoint',
    (endpoint) => {
      const key = createScFindKey(scFindEndpoint, endpoint, {});
      expect(key).toContain(endpoint);
      expectURLIsValid(key);
    },
  );

  it.each([
    {
      params: {
        param1: 'value1',
        param2: 'value2',
        param3: undefined,
      },
      definedKeys: ['param1', 'param2'],
      undefinedKeys: ['param3'],
    },
  ])('should filter out undefined passed params', ({ params, definedKeys, undefinedKeys }) => {
    const key = createScFindKey(scFindEndpoint, 'endpoint', params);
    definedKeys.forEach((k) => {
      expect(key.includes(k)).toBe(true);
    });
    undefinedKeys.forEach((k) => {
      expect(key.includes(k)).toBe(false);
    });
    expectURLIsValid(key);
  });
});

describe('formatCellTypeName', () => {
  it('should remove organ prefix from cell type name', () => {
    const cellType = 'organ.cellType';
    const formatted = formatCellTypeName(cellType);
    expect(formatted).toBe('cellType');
  });

  it('should return the same name if no organ prefix is present', () => {
    const cellType = 'cellType';
    const formatted = formatCellTypeName(cellType);
    expect(formatted).toBe('cellType');
  });

  it('should handle empty strings', () => {
    const cellType = '';
    const formatted = formatCellTypeName(cellType);
    expect(formatted).toBe('');
  });
});

describe('extractCellTypeInfo', () => {
  it('should extract organ, name, and variant from cell type string', () => {
    const cellType = 'brain.neuron:adult';
    const result = extractCellTypeInfo(cellType);
    expect(result).toEqual({ organ: 'brain', name: 'neuron', variant: 'adult' });
  });

  it('should handle cell types without variants', () => {
    const cellType = 'heart.muscle';
    const result = extractCellTypeInfo(cellType);
    expect(result).toEqual({ organ: 'heart', name: 'muscle', variant: undefined });
  });

  it('should handle empty cell type string', () => {
    const cellType = '';
    const result = extractCellTypeInfo(cellType);
    expect(result).toEqual({ organ: '', name: '', variant: undefined });
  });
});

describe('extractCellTypesInfo', () => {
  it('should extract name, organs, and variants from cell types array', () => {
    const cellTypes = ['brain.neuron:adult', 'heart.muscle', 'lung.epithelial:child'];
    const result = extractCellTypesInfo(cellTypes);
    expect(result).toEqual({
      name: 'neuron',
      organs: ['brain', 'heart', 'lung'],
      variants: {
        brain: ['adult'],
        heart: [],
        lung: ['child'],
      },
    });
  });

  it('should handle empty cell types array', () => {
    const cellTypes: string[] = [];
    const result = extractCellTypesInfo(cellTypes);
    expect(result).toEqual({
      name: '',
      organs: [],
      variants: {},
    });
  });

  it('should handle cell types with no variants', () => {
    const cellTypes = ['brain.neuron', 'heart.muscle'];
    const result = extractCellTypesInfo(cellTypes);
    expect(result).toEqual({
      name: 'neuron',
      organs: ['brain', 'heart'],
      variants: {
        brain: [],
        heart: [],
      },
    });
  });
});

describe('cellTypeNameContainsComma', () => {
  it('returns false for undefined input', () => {
    expect(cellTypeNameContainsComma(undefined)).toBe(false);
  });

  it('returns false for empty array', () => {
    expect(cellTypeNameContainsComma([])).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(cellTypeNameContainsComma('')).toBe(false);
  });

  it('returns false for a single comma-free string', () => {
    expect(cellTypeNameContainsComma('CD4 T cell')).toBe(false);
  });

  it('returns true for a single string containing a comma', () => {
    expect(cellTypeNameContainsComma('CD4, T cell')).toBe(true);
  });

  it('returns false for an array of comma-free strings', () => {
    expect(cellTypeNameContainsComma(['CD4 T cell', 'CD8 T cell'])).toBe(false);
  });

  it('returns true when any array element contains a comma', () => {
    expect(cellTypeNameContainsComma(['CD4 T cell', 'CD8, T cell'])).toBe(true);
  });
});

describe('createScFindPostRequest', () => {
  it('builds a URL with no query string and the params in the body', () => {
    const request = createScFindPostRequest(scFindEndpoint, 'cellTypeMarkers', {
      cell_types: ['CD4, T cell', 'CD8 T cell'],
      top_k: 10,
    });
    expect(request.url).toBe(`${scFindEndpoint}/api/cellTypeMarkers`);
    expect(request.body).toEqual({
      cell_types: ['CD4, T cell', 'CD8 T cell'],
      top_k: 10,
    });
  });

  it('drops undefined entries from the body', () => {
    const request = createScFindPostRequest(scFindEndpoint, 'cellTypeMarkers', {
      cell_types: ['CD4, T cell'],
      background_cell_types: undefined,
      sort_field: undefined,
      top_k: 5,
    });
    expect(request.body).toEqual({
      cell_types: ['CD4, T cell'],
      top_k: 5,
    });
  });

  it('includes index_version in the body when provided', () => {
    const request = createScFindPostRequest(scFindEndpoint, 'cellTypeMarkers', { cell_types: ['CD4, T cell'] }, 'v1');
    expect(request.body).toEqual({
      cell_types: ['CD4, T cell'],
      index_version: 'v1',
    });
  });
});

describe('createFindDatasetForCellTypeKey', () => {
  it('returns null for an empty cell type', () => {
    expect(createFindDatasetForCellTypeKey(scFindEndpoint, { cellType: '' })).toBeNull();
  });

  it('builds a GET URL for a comma-free cell type', () => {
    const key = createFindDatasetForCellTypeKey(scFindEndpoint, { cellType: 'CD4 T cell' });
    expect(typeof key).toBe('string');
    expect(key).toContain('cell_type=CD4');
  });

  it('builds a POST request when the cell type contains a comma', () => {
    const key = createFindDatasetForCellTypeKey(scFindEndpoint, { cellType: 'CD4, T cell' });
    expect(typeof key).toBe('object');
    expect(key).toEqual({
      url: `${scFindEndpoint}/api/findDatasetForCellType`,
      body: { cell_type: 'CD4, T cell' },
    });
  });
});
