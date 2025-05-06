import useFindDatasetsForCellTypes from 'js/api/scfind/useFindDatasetForCellTypes';
import { ChangeEvent, useMemo } from 'react';
import { Dataset } from 'js/components/types';
import useFindDatasetForGenes from 'js/api/scfind/useFindDatasetForGenes';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';
import { useMolecularDataQueryFormTracking } from '../MolecularDataQueryForm/MolecularDataQueryFormTrackingProvider';

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

export function useSCFindGeneResults() {
  const genes = useCellVariableNames();

  return useFindDatasetForGenes({
    geneList: genes,
  });
}

export function useDeduplicatedResults(datasets: Record<string, (Pick<Dataset, 'hubmap_id'> | string)[]>) {
  return useMemo(() => {
    const uniqueResults = Object.values(datasets)
      .flat()
      .reduce((acc, dataset) => {
        if (typeof dataset === 'string') {
          if (!acc.has(dataset)) {
            acc.add(dataset);
          }
        } else {
          const { hubmap_id } = dataset;
          if (!acc.has(hubmap_id)) {
            acc.add(hubmap_id);
          }
        }
        return acc;
      }, new Set<string>());
    return Array.from(uniqueResults);
  }, [datasets]);
}

export function useTableTrackingProps() {
  const { track, sessionId } = useMolecularDataQueryFormTracking();
  return useMemo(() => {
    const onSelectAllChange = (e: ChangeEvent<HTMLInputElement>) => {
      const isSelected = e.target.checked;
      if (isSelected) {
        track('Results / Select All Datasets');
      }
    };
    const onSelectChange = (e: ChangeEvent<HTMLInputElement>, id: string) => {
      const isSelected = e.target.checked;
      if (isSelected) {
        track('Results / Select Dataset', id);
      }
    };
    const trackingInfo = {
      category: 'Molecular and Cellular Query',
      action: 'Results',
      label: sessionId,
    };
    return {
      onSelectAllChange,
      onSelectChange,
      trackingInfo,
    };
  }, [track, sessionId]);
}
