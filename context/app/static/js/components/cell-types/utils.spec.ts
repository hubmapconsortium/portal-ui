import { extractCellTypeInfo, extractCellTypesInfo } from './utils';

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
