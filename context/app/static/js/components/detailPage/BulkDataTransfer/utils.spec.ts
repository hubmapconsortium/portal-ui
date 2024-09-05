import { sanitizeLabel } from './utils';

describe('sanitizeLabel', () => {
  it('should not change any labels that do not contain square brackets', () => {
    const label = 'Some label';
    expect(sanitizeLabel(label)).toBe(label);
  });
  it('should remove the HuBMAP ID from the label', () => {
    const label = 'Some label [HuBMAP-123]';
    expect(sanitizeLabel(label)).toBe('Some label');
  });
});
