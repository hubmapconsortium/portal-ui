import { CellTypeCountForTissue } from 'js/api/scfind/useCellTypeCountForTissue';
import { addPercentageAndOrganToCellTypeCounts } from './utils';

const testCellTypeCounts: CellTypeCountForTissue[] = [
  { index: 'organ.Cell Type 1', cell_count: 150 },
  { index: 'organ.Cell Type 2', cell_count: 250 },
  { index: 'organ.Cell Type 3', cell_count: 400 },
];

describe('addPercentageAndOrganToCellTypeCounts', () => {
  it('should add percentage and organ to cell type counts', () => {
    const totalCellCount = 800;
    const result = addPercentageAndOrganToCellTypeCounts(testCellTypeCounts, totalCellCount, 'Test Organ');
    expect(result).toEqual([
      { name: 'Cell Type 1', count: 150, organ: 'Test Organ', percentage: 0.1875 },
      { name: 'Cell Type 2', count: 250, organ: 'Test Organ', percentage: 0.3125 },
      { name: 'Cell Type 3', count: 400, organ: 'Test Organ', percentage: 0.5 },
    ]);
  });
});
