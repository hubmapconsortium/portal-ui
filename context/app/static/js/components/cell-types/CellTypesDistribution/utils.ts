import { CellTypeCountForTissue } from 'js/api/scfind/useCellTypeCountForTissue';
import { formatCellTypeName } from 'js/api/scfind/utils';

export interface CellTypeCountWithPercentageAndOrgan {
  name: string;
  count: number;
  percentage: number;
  organ: string;
}

export function addPercentageAndOrganToCellTypeCounts(
  cellTypeCounts: CellTypeCountForTissue[],
  totalCellCount: number,
  organ: string,
): CellTypeCountWithPercentageAndOrgan[] {
  return cellTypeCounts.map((count) => ({
    name: formatCellTypeName(count.index),
    count: count.cell_count,
    organ,
    percentage: totalCellCount > 0 ? count.cell_count / totalCellCount : 0,
  }));
}
