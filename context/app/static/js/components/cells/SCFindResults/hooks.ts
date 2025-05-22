import useFindDatasetsForCellTypes from 'js/api/scfind/useFindDatasetForCellTypes';
import { ChangeEvent, useMemo } from 'react';
import { Dataset } from 'js/components/types';
import useFindDatasetForGenes from 'js/api/scfind/useFindDatasetForGenes';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';
import { useMolecularDataQueryFormTracking } from '../MolecularDataQueryForm/MolecularDataQueryFormTrackingProvider';
import { useSelectedPathwayParticipants } from '../MolecularDataQueryForm/AutocompleteEntity/hooks';
import { categorizeCellTypes, mapDatasetsToCellTypeCategories, processGeneQueryResults } from './utils';
import { getUnwrappedResult } from './types';

export function useSCFindCellTypeResults() {
  const cellTypes = useCellVariableNames();

  // The index of the dataset results matches the index of the cell types
  // in the original cellVariableNames array.
  const datasetsWithCellTypes = useFindDatasetsForCellTypes({
    cellTypes,
  });

  const { data = [], ...rest } = datasetsWithCellTypes;

  const cellTypeCategories = useMemo(() => categorizeCellTypes(cellTypes), [cellTypes]);

  const datasets = useMemo(
    () => mapDatasetsToCellTypeCategories(cellTypeCategories, cellTypes, data),
    [cellTypeCategories, cellTypes, data],
  );

  return { datasets, cellTypeCategories, ...rest };
}

export function useSCFindGeneResults() {
  const genes = useCellVariableNames();

  const { participants, name: pathwayName, isLoading: isLoadingPathwayGenes } = useSelectedPathwayParticipants();

  const {
    isLoading: isLoadingDatasets,
    data,
    ...results
  } = useFindDatasetForGenes({
    geneList: genes,
  });

  // Gene query results have the following categories:
  // - Each individual gene
  // - Union of all results for genes in the same pathway, with pathway name as the key
  // - If the intersection of the genes in the same pathway is not empty, it is also a category
  // - Any genes that do not have a result are separately listed
  const { categorizedResults, emptyResults, order, datasetToGeneMap } = useMemo(() => {
    return processGeneQueryResults({
      data,
      genes,
      participants,
      pathwayName,
    });
  }, [data, genes, pathwayName, participants]);

  return {
    datasets: data,
    categorizedResults,
    datasetToGeneMap,
    isLoading: isLoadingDatasets || isLoadingPathwayGenes,
    emptyResults,
    order,
    ...results,
  };
}

export function useDeduplicatedResults(datasets?: Record<string, (Pick<Dataset, 'hubmap_id'> | string)[]>) {
  return useMemo(() => {
    if (!datasets) {
      return [];
    }
    const uniqueResults = Object.values(datasets)
      .flat()
      .reduce((acc, dataset) => {
        acc.add(getUnwrappedResult(dataset));
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
