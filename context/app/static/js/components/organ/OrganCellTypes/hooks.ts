import { useMemo } from 'react';

import useFindDatasetForCellTypes from 'js/api/scfind/useFindDatasetForCellTypes';
import { percent } from 'js/helpers/number-format';
import { useIndexedDatasetsForOrgan } from 'js/pages/Organ/hooks';
import { useLabelsToCLIDs } from 'js/api/scfind/useLabelToCLID';
import { stripCLIDPrefix, useCellTypeOntologyDetails } from 'js/hooks/useUBKG';
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
  const { datasets: totalIndexedDatasets, isLoadingDatasets: isLoadingTotalDatasets } = useIndexedDatasetsForOrgan();

  const cellTypeIds = useMemo(
    () => clids?.map((clid) => clid?.CLIDs?.[0]).filter((id): id is string => id != null) ?? [],
    [clids],
  );

  const { data: cellTypeDetails, isLoading: isLoadingDescriptions } = useCellTypeOntologyDetails(cellTypeIds);

  const rows = useMemo(() => {
    return (
      cellTypes
        .map((cellType, index) => {
          const matches = matchedDatasets?.[index]?.datasets ?? [];
          const matchedDatasetsCount = matches.length;
          const percentage = percent.format(matchedDatasetsCount / totalIndexedDatasets.length);
          const clid = clids?.[index].CLIDs?.[0];
          const description = (clid && cellTypeDetails?.[stripCLIDPrefix(clid)]?.definition) ?? '';

          return {
            cellType,
            clid,
            matchedDatasets: matches,
            totalIndexedDatasets: totalIndexedDatasets.length,
            percentage,
            description,
          };
        })
        // Hide the "other" cell type annotation
        .filter((row) => row.cellType.toLowerCase() !== 'other')
    );
  }, [cellTypes, clids, matchedDatasets, totalIndexedDatasets.length, cellTypeDetails]);

  const isLoading = isLoadingClids || isLoadingMatchedDatasets || isLoadingTotalDatasets || isLoadingDescriptions;

  return {
    rows,
    isLoading,
    isLoadingDescriptions,
  };
}
