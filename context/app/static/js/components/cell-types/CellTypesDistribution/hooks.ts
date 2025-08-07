import { useCellTypeCountForTissues } from 'js/api/scfind/useCellTypeCountForTissue';
import { useLinearScale, useSymLogScale } from 'js/shared-styles/charts/hooks';
import { useMemo } from 'react';
import { extractCellTypeInfo, formatCellTypeName } from 'js/api/scfind/utils';
import { useCellTypesDistributionChartContext } from './contexts';
import { addPercentageAndOrganToCellTypeCounts, CellTypeCountWithPercentageAndOrgan } from './utils';
import { ChartData } from './types';
/**
 * Creates Y axis scales for the cell types distribution chart based on the provided data and maximum cell count.
 * The appropriate scale is chosen based on the context settings for showing percentages and using symmetric log scale.
 * @param data An array containing cell type counts and percentages.
 * @param maxCellCount The maximum cell count across all organs, used to set the domain of the scale.
 * @returns The Y axis scale for the chart.
 */
export const useYScale = (data: CellTypeCountWithPercentageAndOrgan[], maxCellCount: number) => {
  const { showPercentages, symLogScale } = useCellTypesDistributionChartContext();

  const { counts, percentages } = useMemo(() => {
    return { counts: data.map((d) => d.count), percentages: data.map((d) => d.percentage) };
  }, [data]);

  const countsDomain = [0, maxCellCount];

  const totalCountsScaleSymLog = useSymLogScale(counts, {
    domain: countsDomain,
  });

  const totalCountsScale = useLinearScale(counts, {
    domain: countsDomain,
    nice: true,
  });

  const percentageScale = useLinearScale(percentages, {
    domain: [0, 1],
    nice: true,
    round: true,
  });

  if (showPercentages) {
    return percentageScale;
  }

  if (symLogScale) {
    return totalCountsScaleSymLog;
  }

  return totalCountsScale;
};

export function useCellTypeCountData(organs: string[], cellTypes: string[]) {
  const { showOtherCellTypes, showPercentages } = useCellTypesDistributionChartContext();
  const { data = [], isLoading } = useCellTypeCountForTissues(organs);

  const [targetCellTypeKeys, otherCellTypeKeys, allCellTypeKeys] = useMemo(() => {
    const formattedCellTypes = Array.from(new Set(cellTypes.map((name) => formatCellTypeName(name))));
    const allOtherCellTypes = Array.from(
      new Set(
        data.flatMap((item) =>
          item.cellTypeCounts
            .filter((count) => !cellTypes.includes(count.index))
            .map((count) => formatCellTypeName(count.index)),
        ),
      ),
    );

    const allCellTypes = Array.from(new Set([...formattedCellTypes, ...allOtherCellTypes]));

    return [formattedCellTypes, allOtherCellTypes, allCellTypes];
  }, [cellTypes, data]);

  // Categorize the cell type counts for each organ based on the provided cell types
  const cellTypeCountsRecord = useMemo(() => {
    // The order of the cell type counts is determined by the order of the `organ` array
    const record: Record<string, CellTypeCountWithPercentageAndOrgan[]> = {};
    const totalCountsForOrgan: Record<string, number> = data.reduce<Record<string, number>>((acc, item) => {
      item.cellTypeCounts.forEach((count) => {
        const { organ } = extractCellTypeInfo(count.index);
        acc[organ] = (acc[organ] || 0) + count.cell_count;
      });
      return acc;
    }, {});

    data.forEach((item, idx) => {
      const organ = organs[idx];
      const totalCellCountForOrgan = totalCountsForOrgan[organ] || 0;
      record[organ] = addPercentageAndOrganToCellTypeCounts(item.cellTypeCounts, totalCellCountForOrgan, organ);
    });
    return record;
  }, [data, organs]);

  const maxCellCount = useMemo(() => {
    // Find the maximum cell count across all organs
    return Object.values(cellTypeCountsRecord).reduce((max, counts) => {
      const countsToUse = showOtherCellTypes
        ? counts
        : counts.filter((count) => targetCellTypeKeys.includes(count.name));
      const organSum = countsToUse.reduce((sum, count) => sum + count.count, 0);
      return Math.max(max, organSum);
    }, 0);
  }, [cellTypeCountsRecord, showOtherCellTypes, targetCellTypeKeys]);

  const fullCellTypeData = useMemo(() => Object.values(cellTypeCountsRecord).flat(), [cellTypeCountsRecord]);

  const visxData = useMemo(() => {
    const transformedData = fullCellTypeData.reduce((acc: ChartData[], curr: CellTypeCountWithPercentageAndOrgan) => {
      const existingOrgan = acc.find((d) => d.organ === curr.organ);
      if (existingOrgan) {
        existingOrgan[curr.name] = showPercentages ? curr.percentage : curr.count;
      } else {
        const newOrganData: ChartData = { organ: curr.organ };
        newOrganData[curr.name] = showPercentages ? curr.percentage : curr.count;
        acc.push(newOrganData);
      }
      return acc;
    }, []);
    // The data for both organs has to have the same keys, so we need to ensure that all organs have the same cell type keys
    const keysToUse = showOtherCellTypes ? [...targetCellTypeKeys, ...otherCellTypeKeys] : targetCellTypeKeys;
    const normalizedData = transformedData.map((d) => {
      const completeData: ChartData = { organ: d.organ };
      keysToUse.forEach((key) => {
        completeData[key] = d[key] || 0; // Ensure all keys are present, defaulting to 0 if not found
      });
      return completeData;
    });
    return normalizedData;
  }, [fullCellTypeData, showOtherCellTypes, targetCellTypeKeys, otherCellTypeKeys, showPercentages]);

  return {
    cellTypeCountsRecord,
    maxCellCount,
    isLoading,
    targetCellTypeKeys,
    otherCellTypeKeys,
    allCellTypeKeys,
    visxData,
    fullCellTypeData,
  };
}
