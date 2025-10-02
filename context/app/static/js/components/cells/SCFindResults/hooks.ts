import useFindDatasetsForCellTypes from 'js/api/scfind/useFindDatasetForCellTypes';
import { ChangeEvent, useMemo } from 'react';
import { Dataset } from 'js/components/types';
import useFindDatasetForGenes from 'js/api/scfind/useFindDatasetForGenes';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';
import { useMolecularDataQueryFormTracking } from '../MolecularDataQueryForm/MolecularDataQueryFormTrackingProvider';
import { useSelectedPathwayParticipants } from '../MolecularDataQueryForm/AutocompleteEntity/hooks';
import { categorizeCellTypes, mapDatasetsToCellTypeCategories, processGeneQueryResults } from './utils';
import { getUnwrappedResult } from './types';

export function useSCFindCellTypeResults(cellTypes: string[] = []) {
  // The index of the dataset results matches the index of the cell types
  // in the original cellVariableNames array.

  const datasetsWithCellTypes = useFindDatasetsForCellTypes({
    cellTypes,
  });

  const { data = [], countsMaps, ...rest } = datasetsWithCellTypes;

  const cellTypeCategories = useMemo(() => categorizeCellTypes(cellTypes), [cellTypes]);

  const datasets = useMemo(
    () => mapDatasetsToCellTypeCategories(cellTypeCategories, cellTypes, data),
    [cellTypeCategories, cellTypes, data],
  );

  // Create count maps for each category by aggregating counts from individual cell types
  const categorizedCountsMaps = useMemo(() => {
    if (!countsMaps || Object.keys(countsMaps).length === 0) {
      return {};
    }

    const categoryMaps: Record<string, Record<string, number>> = {};

    // Initialize maps for all categories
    cellTypeCategories.forEach((category) => {
      categoryMaps[category] = {};
    });

    // For each cell type, aggregate its counts into the appropriate categories
    cellTypes.forEach((cellType) => {
      const cellTypeCounts = countsMaps[cellType];
      if (!cellTypeCounts) return;

      const [organCategory, cellTypeCategory] = cellType.split('.');
      const categories = [cellType, organCategory, cellTypeCategory].filter((cat) => cellTypeCategories.includes(cat));

      // Add counts to each relevant category
      Object.entries(cellTypeCounts).forEach(([datasetId, count]) => {
        categories.forEach((category) => {
          if (categoryMaps[category]) {
            // For categories that aggregate multiple cell types, sum the counts
            // For individual cell types, use the count directly
            categoryMaps[category][datasetId] = (categoryMaps[category][datasetId] || 0) + count;
          }
        });
      });
    });

    return categoryMaps;
  }, [countsMaps, cellTypes, cellTypeCategories]);

  return { datasets, cellTypeCategories, countsMaps: categorizedCountsMaps, ...rest };
}

export function useSCFindGeneResults() {
  const genes = useCellVariableNames();

  const { participants, pathwayName, isLoading: isLoadingPathwayGenes } = useSelectedPathwayParticipants();

  const {
    isLoading: isLoadingDatasets,
    data,
    countsMaps,
    ...results
  } = useFindDatasetForGenes({
    geneList: genes,
  });

  // Gene query results have the following categories:
  // - Each individual gene
  // - Union of all results for genes in the same pathway, with pathway name as the key
  // - If the intersection of the genes in the same pathway is not empty, it is also a category
  // - Any genes that do not have a result are separately listed
  const { categorizedResults, emptyResults, order, datasetToGeneMap, noResults } = useMemo(() => {
    return processGeneQueryResults({
      data,
      genes,
      participants,
      pathwayName,
    });
  }, [data, genes, pathwayName, participants]);

  // Create count maps for each category by aggregating counts from individual genes
  const categorizedCountsMaps = useMemo(() => {
    if (!countsMaps || Object.keys(countsMaps).length === 0 || !order) {
      return {};
    }

    const categoryMaps: Record<string, Record<string, number>> = {};

    // Initialize maps for all categories (order contains the categories)
    order.forEach((category) => {
      categoryMaps[category] = {};
    });

    // For individual genes, use their counts directly
    genes.forEach((gene) => {
      if (countsMaps[gene] && order.includes(gene)) {
        categoryMaps[gene] = { ...countsMaps[gene] };
      }
    });

    // For pathway categories, aggregate counts from genes in that pathway
    if (pathwayName && participants.length > 0) {
      // Union of all genes in pathway
      if (order.includes(pathwayName)) {
        const pathwayDatasets = new Set<string>();
        participants.forEach((gene) => {
          if (countsMaps[gene]) {
            Object.keys(countsMaps[gene]).forEach((datasetId) => {
              pathwayDatasets.add(datasetId);
            });
          }
        });

        pathwayDatasets.forEach((datasetId) => {
          // Sum counts for all genes in this dataset for this pathway
          let totalCount = 0;
          participants.forEach((gene) => {
            if (countsMaps[gene] && countsMaps[gene][datasetId]) {
              totalCount += countsMaps[gene][datasetId];
            }
          });
          if (totalCount > 0) {
            categoryMaps[pathwayName][datasetId] = totalCount;
          }
        });
      }

      // Intersection category (if it exists)
      const intersectionKey = `${pathwayName} (intersection)`;
      if (order.includes(intersectionKey)) {
        // Find datasets that have all genes in the pathway
        const allPathwayDatasets = participants.map((gene) => (countsMaps[gene] ? Object.keys(countsMaps[gene]) : []));

        if (allPathwayDatasets.length > 0) {
          const intersectionDatasets = allPathwayDatasets.reduce((acc, datasets) =>
            acc.filter((datasetId) => datasets.includes(datasetId)),
          );

          intersectionDatasets.forEach((datasetId) => {
            // For intersection, use the minimum count among all genes
            let minCount = Infinity;
            participants.forEach((gene) => {
              if (countsMaps[gene] && countsMaps[gene][datasetId]) {
                minCount = Math.min(minCount, countsMaps[gene][datasetId]);
              }
            });
            if (minCount !== Infinity && minCount > 0) {
              categoryMaps[intersectionKey][datasetId] = minCount;
            }
          });
        }
      }
    }

    return categoryMaps;
  }, [countsMaps, genes, order, pathwayName, participants]);

  return {
    datasets: data,
    categorizedResults,
    datasetToGeneMap,
    countsMaps: categorizedCountsMaps,
    isLoading: isLoadingDatasets || isLoadingPathwayGenes,
    emptyResults,
    order,
    noResults,
    ...results,
  };
}

export function useDeduplicatedResults(datasets?: Record<string, (Pick<Dataset, 'hubmap_id'> | string)[]>): string[] {
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
  const { track, label, category } = useMolecularDataQueryFormTracking();
  return useMemo(() => {
    const prefix = {
      'Molecular and Cellular Query': 'Results',
      'Gene Detail Page': 'Datasets / Results',
      'Cell Type Detail Page': 'Datasets / Results',
    }[category];
    const onSelectAllChange = (e: ChangeEvent<HTMLInputElement>) => {
      const isSelected = e.target.checked;
      if (isSelected) {
        track(`${prefix} / Select All Datasets`);
      }
    };
    const onSelectChange = (e: ChangeEvent<HTMLInputElement>, id: string) => {
      const isSelected = e.target.checked;
      if (isSelected) {
        track(`${prefix} / Select Dataset`, id);
      }
    };
    const onExpand = (id: string) => (isExpanded: boolean) => {
      const action = isExpanded ? 'Expand' : 'Collapse';
      track(`${prefix} / ${action} Dataset`, id);
    };

    const trackingInfo = {
      category,
      action: prefix,
      label,
    };
    return {
      onSelectAllChange,
      onSelectChange,
      onExpand,
      trackingInfo,
    };
  }, [track, label, category]);
}
