import { CellTypeCountForTissue } from 'js/api/scfind/useCellTypeCountForTissue';
import { formatCellTypeName } from 'js/api/scfind/utils';

export function categorizeCellTypeCounts(
  cellTypeCounts: CellTypeCountForTissue[],
  targetCellTypes: string[],
): CellTypeCountForTissue[] {
  const [targetCellCounts, otherCellCount] = cellTypeCounts.reduce<[CellTypeCountForTissue[], CellTypeCountForTissue]>(
    ([acc, other], count) => {
      if (targetCellTypes.includes(count.index)) {
        const countWithFormattedName = {
          ...count,
          index: formatCellTypeName(count.index),
        };
        acc.push(countWithFormattedName);
      } else {
        other.cell_count += count.cell_count;
      }
      return [acc, other];
    },
    [
      [],
      {
        index: 'Other Cell Types',
        cell_count: 0,
      },
    ],
  );
  return [...targetCellCounts, otherCellCount];
}

export interface CellTypeCountWithPercentageAndOrgan {
  name: string;
  count: number;
  percentage: number;
  organ: string;
}

export function addPercentageToCellTypeCounts(
  cellTypeCounts: CellTypeCountForTissue[],
  totalCellCount: number,
  organ: string,
): CellTypeCountWithPercentageAndOrgan[] {
  return cellTypeCounts.map((count) => ({
    name: count.index,
    count: count.cell_count,
    organ,
    percentage: totalCellCount > 0 ? (count.cell_count / totalCellCount) * 100 : 0,
  }));
}
