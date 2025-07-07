import { createScFindKey, extractCellTypeInfo, extractCellTypesInfo, formatCellTypeName } from './utils';

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
