import { mapObjectType, mapPluralObjectType, objectTypeLabels, pluralObjectTypeLabels } from './annotations';

describe('mapObjectType', () => {
  test('returns human-readable label for known CL ID', () => {
    expect(mapObjectType('CL:0000000')).toBe('Cell');
  });

  test('returns human-readable label for known UBERON IDs', () => {
    expect(mapObjectType('UBERON:0000074')).toBe('Renal Glomeruli');
    expect(mapObjectType('UBERON:0001637')).toBe('Artery');
    expect(mapObjectType('UBERON:0009773')).toBe('Renal Tubule');
  });

  test('returns the raw ID for unknown ontology IDs', () => {
    expect(mapObjectType('CL:9999999')).toBe('CL:9999999');
    expect(mapObjectType('UBERON:1234567')).toBe('UBERON:1234567');
  });

  test('covers all entries in objectTypeLabels', () => {
    Object.entries(objectTypeLabels).forEach(([id, label]) => {
      expect(mapObjectType(id)).toBe(label);
    });
  });
});

describe('mapPluralObjectType', () => {
  test('returns plural human-readable label for known CL ID', () => {
    expect(mapPluralObjectType('CL:0000000')).toBe('Cells');
  });

  test('returns plural human-readable label for known UBERON IDs', () => {
    expect(mapPluralObjectType('UBERON:0000074')).toBe('Renal Glomeruli');
    expect(mapPluralObjectType('UBERON:0001637')).toBe('Arteries');
    expect(mapPluralObjectType('UBERON:0009773')).toBe('Renal Tubules');
  });

  test('returns the raw ID for unknown ontology IDs', () => {
    expect(mapPluralObjectType('CL:9999999')).toBe('CL:9999999');
    expect(mapPluralObjectType('UBERON:1234567')).toBe('UBERON:1234567');
  });

  test('covers all entries in pluralObjectTypeLabels', () => {
    Object.entries(pluralObjectTypeLabels).forEach(([id, label]) => {
      expect(mapPluralObjectType(id)).toBe(label);
    });
  });
});
