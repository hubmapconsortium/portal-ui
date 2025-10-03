import { categorizeCellTypes, processGeneQueryResults } from './utils';

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

    const expectedLabels = [
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

    // Check that all expected labels are present
    expectedLabels.forEach((expectedLabel) => {
      expect(result.some((category) => category.label === expectedLabel)).toBe(true);
    });
  });

  test('processGeneQueryResults', () => {
    const datasets = [
      'HBM437.LCSH.956',
      'HBM444.DXLZ.643',
      'HBM449.QGGL.994',
      'HBM468.SSXX.967',
      'HBM475.NWHG.922',
      'HBM482.DKQF.747',
      'HBM539.GJNB.784',
      'HBM546.RNHX.756',
      'HBM573.JGLL.575',
      'HBM723.QMLJ.829',
      'HBM727.DWPV.852',
      'HBM762.RPDR.282',
      'HBM787.XCSX.733',
      'HBM823.CNRW.484',
      'HBM834.TDFD.294',
      'HBM853.GWTP.895',
      'HBM887.DDJL.589',
      'HBM967.LPHM.957',
      'HBM976.MRWH.263',
    ];
    const data = {
      findDatasets: {
        BCL2: datasets,
        BCL2L1: datasets,
      },
      counts: {
        BCL2: new Array(datasets.length).fill(1),
        BCL2L1: new Array(datasets.length).fill(2),
      },
    };
    const genes = ['BBC3', 'BCL2', 'BCL2L1', 'PMAIP1'];
    const pathwayName = 'Apoptosis';
    const participants = ['BBC3', 'BCL2', 'BCL2L1', 'PMAIP1'];

    const { categorizedResults, emptyResults, order, datasetToGeneMap } = processGeneQueryResults({
      data,
      genes,
      pathwayName,
      participants,
    });

    const categories = Object.keys(categorizedResults).sort();

    expect(categories).toEqual(['Any Genes in Apoptosis', 'BCL2', 'BCL2L1']);
    expect(emptyResults).toEqual(['BBC3', 'PMAIP1']);
    expect(order).toEqual(['Any Genes in Apoptosis', 'BCL2', 'BCL2L1']);
    Object.values(datasetToGeneMap).forEach((value) => {
      expect(value).toEqual(new Set(['BCL2', 'BCL2L1']));
    });
  });
});
