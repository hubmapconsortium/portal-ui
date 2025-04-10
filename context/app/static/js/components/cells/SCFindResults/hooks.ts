import useFindDatasetsForCellTypes from 'js/api/scfind/useFindDatasetForCellTypes';
import { useMemo } from 'react';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';

export function useSCFindCellTypeResults() {
  const cellVariableNames = useCellVariableNames();

  // The index of the dataset results matches the index of the cell types
  // in the original cellVariableNames array.
  const datasetsWithCellTypes = useFindDatasetsForCellTypes({
    cellTypes: cellVariableNames,
  });

  const { data = [], ...rest } = datasetsWithCellTypes;

  // deduplicate datasets
  const datasets = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }
    return [...new Set(data.map((dataset) => dataset.datasets).flat())];
  }, [data]);

  return { datasets, ...rest };
}
