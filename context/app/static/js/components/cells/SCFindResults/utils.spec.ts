import { categorizeCellTypes } from './utils';

describe('SCFindResults utils', () => {
  test('categorizeCellTypes', () => {
    const cellTypes = [
      'Lung.B cells',
      'Lung.T cells',
      'Liver.B cells',
      'Liver.T cells',
      'Liver.CD4+ T cells',
      'Liver.CD8+ T cells',
    ];

    const result = categorizeCellTypes(cellTypes);

    const expected = [
      'Lung.B cells',
      'Lung.T cells',
      'Liver.B cells',
      'Liver.T cells',
      'Liver.CD4+ T cells',
      'Liver.CD8+ T cells',
      'Lung',
      'Liver',
      'B cells',
      'T cells',
    ];

    expected.forEach((item) => {
      expect(result).toContain(item);
    });
  });
});
