import { compareSampleCategory } from './samples';

describe('compareSampleCategory', () => {
  it('should return 0 for identical categories', () => {
    expect(compareSampleCategory('Organ', 'Organ')).toBe(0);
    expect(compareSampleCategory('Block', 'Block')).toBe(0);
    expect(compareSampleCategory('Section', 'Section')).toBe(0);
    expect(compareSampleCategory('Suspension', 'Suspension')).toBe(0);
  });

  it('should sort categories in the correct order', () => {
    expect(compareSampleCategory('Organ', 'Block')).toBeLessThan(0);
    expect(compareSampleCategory('Block', 'Section')).toBeLessThan(0);
    expect(compareSampleCategory('Section', 'Suspension')).toBeLessThan(0);
    expect(compareSampleCategory('Organ', 'Suspension')).toBeLessThan(0);

    expect(compareSampleCategory('Block', 'Organ')).toBeGreaterThan(0);
    expect(compareSampleCategory('Section', 'Block')).toBeGreaterThan(0);
    expect(compareSampleCategory('Suspension', 'Section')).toBeGreaterThan(0);
    expect(compareSampleCategory('Suspension', 'Organ')).toBeGreaterThan(0);
  });

  it('should be case-insensitive', () => {
    expect(compareSampleCategory('organ', 'Block')).toBeLessThan(0);
    expect(compareSampleCategory('BLOCK', 'section')).toBeLessThan(0);
    expect(compareSampleCategory('Section', 'suspension')).toBeLessThan(0);
    expect(compareSampleCategory('ORGAN', 'suspension')).toBeLessThan(0);
  });

  it('should handle unknown categories and empty strings by placing them at the end', () => {
    expect(compareSampleCategory('Unknown', 'Organ')).toBeGreaterThan(0);
    expect(compareSampleCategory('Unknown', 'Block')).toBeGreaterThan(0);
    expect(compareSampleCategory('Unknown', 'Section')).toBeGreaterThan(0);
    expect(compareSampleCategory('Unknown', 'Suspension')).toBeGreaterThan(0);

    expect(compareSampleCategory('Organ', 'Unknown')).toBeLessThan(0);
    expect(compareSampleCategory('Block', 'Unknown')).toBeLessThan(0);
    expect(compareSampleCategory('Section', 'Unknown')).toBeLessThan(0);
    expect(compareSampleCategory('Suspension', 'Unknown')).toBeLessThan(0);

    expect(compareSampleCategory('', 'Organ')).toBeGreaterThan(0);
    expect(compareSampleCategory('', 'Block')).toBeGreaterThan(0);
    expect(compareSampleCategory('', 'Section')).toBeGreaterThan(0);
    expect(compareSampleCategory('', 'Suspension')).toBeGreaterThan(0);

    expect(compareSampleCategory('Organ', '')).toBeLessThan(0);
    expect(compareSampleCategory('Block', '')).toBeLessThan(0);
    expect(compareSampleCategory('Section', '')).toBeLessThan(0);
    expect(compareSampleCategory('Suspension', '')).toBeLessThan(0);
  });
});
