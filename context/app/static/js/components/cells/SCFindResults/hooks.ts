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

  // Map datasets to the cell type they contain
  const datasets = useMemo(() => {
    return cellVariableNames.reduce(
      (acc, cellType, index) => {
        const dataset = data[index];
        if (dataset) {
          acc[cellType] = dataset.datasets.map((d) => ({
            hubmap_id: d,
          }));
        }
        return acc;
      },
      {} as Record<string, { hubmap_id: string }[]>,
    );
  }, [data, cellVariableNames]);

  return { datasets, ...rest };
}
