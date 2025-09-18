import { useMemo } from 'react';

import useFindDatasetForCellTypes from 'js/api/scfind/useFindDatasetForCellTypes';
import { percent } from 'js/helpers/number-format';
import { useIndexedDatasetsForOrgan } from 'js/pages/Organ/hooks';
import { useLabelsToCLIDs } from 'js/api/scfind/useLabelToCLID';
import { useFormattedCellTypeNames } from '../hooks';

export function useMatchedDatasets(cellTypes: string[]) {
  const { data: matchedDatasets, isLoading } = useFindDatasetForCellTypes({
    cellTypes,
  });
  const matchedDatasetsCounts = matchedDatasets?.map(({ datasets }) => datasets.length) ?? [];
  return {
    matchedDatasets,
    matchedDatasetsCounts,
    isLoading,
  };
}

export function useCellTypeRows(cellTypes: string[]) {
  const formattedCellNames = useFormattedCellTypeNames(cellTypes);
  const { results: clids, isLoading: isLoadingClids } = useLabelsToCLIDs(formattedCellNames);
  const { matchedDatasets, isLoading: isLoadingMatchedDatasets } = useMatchedDatasets(formattedCellNames);
  const { datasets: totalIndexedDatasets, isLoading: isLoadingTotalDatasets } = useIndexedDatasetsForOrgan();

  const rows = useMemo(() => {
    return (
      cellTypes
        .map((cellType, index) => {
          const matches = matchedDatasets?.[index]?.datasets ?? [];
          const matchedDatasetsCount = matches.length;
          const percentage = percent.format(matchedDatasetsCount / totalIndexedDatasets.length);

          return {
            cellType,
            clid: clids?.[index].CLIDs?.[0],
            matchedDatasets: matches,
            totalIndexedDatasets: totalIndexedDatasets.length,
            percentage,
          };
        })
        // Hide the "other" cell type annotation
        .filter((row) => row.cellType.toLowerCase() !== 'other')
    );
  }, [cellTypes, clids, matchedDatasets, totalIndexedDatasets.length]);

  const isLoading = isLoadingClids || isLoadingMatchedDatasets || isLoadingTotalDatasets;

  return {
    rows,
    isLoading,
  };
}
