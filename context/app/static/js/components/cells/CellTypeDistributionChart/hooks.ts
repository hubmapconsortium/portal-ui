import { CellTypeCountForTissue } from 'js/api/scfind/useCellTypeCountForTissue';

import { useEffect, useMemo } from 'react';
import { ScaleLinear } from 'd3';
import useSCFindResultsStatisticsStore from '../SCFindResults/store';

interface FractionGraphData {
  counts: number[];
  otherLabels: string[];
  targetLabels: string[];
  total: number;
  countsMap: Record<string, number>;
}

export function useProcessedFractionData(data: CellTypeCountForTissue[], targetCellTypes: string[] = []) {
  const processed = useMemo(() => {
    // Sort the data by cell count in descending order, hoisting target cell types to the top
    const sorted = [...(data ?? [])].sort((a, b) => {
      const aIsTarget = targetCellTypes.includes(a.index);
      const bIsTarget = targetCellTypes.includes(b.index);
      if (aIsTarget && !bIsTarget) return -1; // a is target, b is not -> a comes first
      if (!aIsTarget && bIsTarget) return 1; // b is target, a is not -> b comes first
      // If both are target or both are not, sort by cell count, falling back to alphabetical order
      // if the counts are equal
      const diff = b.cell_count - a.cell_count;
      if (diff === 0) {
        return a.index.localeCompare(b.index); // Sort by index if counts are equal
      }
      return diff;
    });
    const results = sorted.reduce(
      ({ counts, otherLabels, targetLabels, total, countsMap }: FractionGraphData, { index: label, cell_count }) => {
        const newTotal = total + cell_count;
        counts.push(cell_count);
        countsMap[label] = cell_count;
        if (!targetCellTypes.includes(label)) {
          otherLabels.push(label);
        } else {
          targetLabels.push(label);
        }
        return {
          counts,
          otherLabels,
          targetLabels,
          total: newTotal,
          countsMap,
        };
      },
      {
        counts: [],
        otherLabels: [],
        targetLabels: [],
        total: 0,
        countsMap: {},
      },
    );
    return {
      ...results,
      sortedData: sorted,
    };
  }, [data, targetCellTypes]);

  const setCellTypeStats = useSCFindResultsStatisticsStore((state) => state.setCellTypeStats);

  useEffect(() => {
    setCellTypeStats({
      total: processed.total,
      targeted: processed.targetLabels.reduce((sum, label) => sum + processed.countsMap[label], 0),
    });
  }, [processed, setCellTypeStats]);

  return processed;
}

export function useXOffsets(cellCounts: number[], scale: ScaleLinear<number, number>) {
  return useMemo(() => {
    const results = cellCounts.reduce(
      ({ currentOffset, offsets }: { currentOffset: number; offsets: number[] }, currentValue) => {
        offsets.push(currentOffset);
        const newOffset: number = currentOffset + scale(currentValue);
        return { currentOffset: newOffset, offsets };
      },
      {
        currentOffset: 0,
        offsets: [],
      },
    );
    return results.offsets;
  }, [cellCounts, scale]);
}
