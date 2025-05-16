import useFindDatasetsForCellTypes from 'js/api/scfind/useFindDatasetForCellTypes';
import { ChangeEvent, useMemo } from 'react';
import { Dataset } from 'js/components/types';
import useFindDatasetForGenes from 'js/api/scfind/useFindDatasetForGenes';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';
import { useMolecularDataQueryFormTracking } from '../MolecularDataQueryForm/MolecularDataQueryFormTrackingProvider';

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
    cellTypes.forEach((cellType, _, arr) => {
      const cellTypeParts = cellType.split('.');
      // This will add `Lung` and `B cells` to the unique cell type categories
      // if there are multiple cell types for the same organ or cell type
      cellTypeParts.forEach((part) => {
        if (arr.filter((ct) => ct.includes(part)).length > 1) {
          uniqueCellTypeCategories.add(part);
        }
      });
    });
    return Array.from(uniqueCellTypeCategories);
  }, [cellTypes]);

  // Map datasets to the cell type they contain
  const datasets = useMemo(() => {
    const datasetsForEachCategory = cellTypes.reduce(
      (acc, cellType, index) => {
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
      },
      {} as Record<string, Set<string>>,
    );
    // Convert the sets to arrays
    return Object.entries(datasetsForEachCategory).reduce(
      (acc, [key, value]) => {
        if (cellTypeCategories.includes(key)) {
          acc[key] = Array.from(value).map((hubmap_id) => ({ hubmap_id }));
        }
        return acc;
      },
      {} as Record<
        string,
        {
          hubmap_id: string;
        }[]
      >,
    );
  }, [cellTypeCategories, cellTypes, data]);

  return { datasets, cellTypeCategories, ...rest };
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
