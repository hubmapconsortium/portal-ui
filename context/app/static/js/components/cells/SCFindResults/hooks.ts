import useFindDatasetsForCellTypes from 'js/api/scfind/useFindDatasetForCellTypes';
import { ChangeEvent, useMemo } from 'react';
import { Dataset } from 'js/components/types';
import useFindDatasetForGenes from 'js/api/scfind/useFindDatasetForGenes';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';
import { useMolecularDataQueryFormTracking } from '../MolecularDataQueryForm/MolecularDataQueryFormTrackingProvider';
import { useSelectedPathwayParticipants } from '../MolecularDataQueryForm/AutocompleteEntity/hooks';

type WrappedDatasetResults = Record<string, Pick<Dataset, 'hubmap_id'>[]>;
type UnwrappedDatasetResults = Record<string, string[]>;

export function useSCFindCellTypeResults() {
  const cellTypes = useCellVariableNames();

  // The index of the dataset results matches the index of the cell types
  // in the original cellVariableNames array.
  const datasetsWithCellTypes = useFindDatasetsForCellTypes({
    cellTypes,
  });

  const { data = [], ...rest } = datasetsWithCellTypes;

  // Get the unique cell type categories
  // if we have "Lung.B cells" and "Lung.T cells", `lung` should be a category
  // if we have "Lung.B cells" and "Liver.B cells", `B cells` should be a category
  // Each individual cell type should also be a category
  const cellTypeCategories = useMemo(() => {
    const uniqueCellTypeCategories = new Set<string>(cellTypes);
    cellTypes.forEach((cellType) => {
      const cellTypeParts = cellType.split('.');
      // This will add `Lung` and `B cells` to the unique cell type categories
      // if there are multiple cell types for the same organ or cell type
      cellTypeParts.forEach((part) => {
        if (cellTypes.filter((ct) => ct.includes(part)).length > 1) {
          uniqueCellTypeCategories.add(part);
        }
      });
    });
    return Array.from(uniqueCellTypeCategories);
  }, [cellTypes]);

  // Map datasets to the cell type they contain
  const datasets = useMemo(() => {
    const datasetsForEachCategory = cellTypes.reduce<Record<string, Set<string>>>((acc, cellType, index) => {
      const cellTypeDatasets = data[index];
      if (!cellTypeDatasets) {
        return acc;
      }

      const [organCategory, cellTypeCategory] = cellType.split('.');
      const keys = [cellType, organCategory, cellTypeCategory];

      cellTypeDatasets.datasets.forEach((dataset) => {
        keys.forEach((key) => {
          acc[key] = acc[key] || new Set();
          acc[key].add(dataset);
        });
      });
      return acc;
    }, {});
    // Convert the sets to arrays
    return Object.entries(datasetsForEachCategory).reduce<WrappedDatasetResults>((acc, [key, value]) => {
      if (cellTypeCategories.includes(key)) {
        acc[key] = Array.from(value).map((hubmap_id) => ({ hubmap_id }));
      }
      return acc;
    }, {});
  }, [cellTypeCategories, cellTypes, data]);

  return { datasets, cellTypeCategories, ...rest };
}

export function useSCFindGeneResults() {
  const genes = useCellVariableNames();

  const { participants, name, isLoading: isLoadingPathwayGenes } = useSelectedPathwayParticipants();

  const { isLoading: isLoadingDatasets, ...results } = useFindDatasetForGenes({
    geneList: genes,
  });

  // Gene query results have the following categories:
  // - Each individual gene
  // - Union of all results for genes in the same pathway, with pathway name as the key
  // - If the intersection of the genes in the same pathway is not empty, it is also a category
  // - Any genes that do not have a result are separately listed
  const { categorizedResults, emptyResults, order, datasetToGeneMap } = useMemo(() => {
    const newResults: UnwrappedDatasetResults = {};
    const empty: string[] = [];
    const keyOrder: string[] = [];
    const datasetGeneMap: Record<string, Set<string>> = {};
    if (results.data) {
      const { findDatasets: originalResults } = results.data;
      // Copy results for each gene to the new results object,
      // populate the datasetGeneMap with the genes that appear in each dataset
      genes.forEach((gene) => {
        const datasets = originalResults[gene] ?? [];
        if (datasets.length > 0) {
          newResults[gene] = datasets;
          datasets.forEach((dataset) => {
            if (!datasetGeneMap[dataset]) {
              datasetGeneMap[dataset] = new Set();
            }
            datasetGeneMap[dataset].add(gene);
          });
        } else {
          empty.push(gene);
        }
      });
      // Handle pathway genes
      if (name && participants.length > 0) {
        const unionKey = `Any Genes in ${name}`;
        // Add the union of all results for genes in the same pathway
        // with the pathway name as the key
        newResults[unionKey] = [];
        participants.forEach((participant) => {
          const datasets = originalResults[participant] ?? [];
          if (datasets && datasets.length > 0) {
            newResults[unionKey].push(...datasets);
          }
        });
        // Deduplicate the union; if the result is empty, remove the key
        newResults[unionKey] = Array.from(new Set(newResults[unionKey]));
        if (newResults[unionKey].length === 0) {
          delete newResults[unionKey];
          empty.push(unionKey);
        } else {
          // If the union is not empty, add it to the key order
          keyOrder.push(unionKey);
          // Check for an intersection of the genes in the same pathway
          // by checking if a dataset in the union is also in the original results for each gene
          const intersectionKey = `All Genes in ${name}`;
          newResults[intersectionKey] = [];
          newResults[unionKey].forEach((dataset) => {
            const isInAll = participants.every((participant) => {
              const datasets = originalResults[participant] ?? [];
              return datasets.includes(dataset);
            });
            if (isInAll) {
              newResults[intersectionKey].push(dataset);
            }
          });
          // If the intersection is empty, remove the key
          // We don't need to add it to the empty results
          if (newResults[intersectionKey].length === 0) {
            delete newResults[intersectionKey];
          } else {
            // If the intersection is not empty, add it to the key order
            keyOrder.push(intersectionKey);
          }
        }
      }

      // Add the individual genes to the key order
      Object.keys(newResults).forEach((key) => {
        if (!keyOrder.includes(key)) {
          keyOrder.push(key);
        }
      });
    }

    return {
      categorizedResults: newResults,
      emptyResults: empty,
      order: keyOrder,
      datasetToGeneMap: datasetGeneMap,
    };
  }, [results.data, genes, name, participants]);

  return {
    datasets: results.data,
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
