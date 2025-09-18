import { FindDatasetForCellTypeResponse } from 'js/api/scfind/useFindDatasetForCellTypes';
import { DatasetsForGenesResponse } from 'js/api/scfind/useFindDatasetForGenes';
import { formatCellTypeName } from 'js/api/scfind/utils';
import { UnwrappedDatasetResults, WrappedDatasetResults } from './types';

/**
 * Get the unique cell type categories
 * if we have "Lung.B cells" and "Lung.T cells", `lung` should be a category
 * if we have "Lung.B cells" and "Liver.B cells", `B cells` should be a category
 * Each individual cell type should also be a category
 * @param cellTypes
 * @returns {string[]}
 */
export function categorizeCellTypes(cellTypes: string[]) {
  const cellTypeCategories: Record<string, number> = {};
  cellTypes.forEach((cellType) => {
    // Add the cell type itself to the categories with a weight of 2 to ensure it is included
    cellTypeCategories[cellType] = 2;

    // Add the organ and cell type to categories with a weight of 1
    const cellTypeParts = cellType.split('.');
    // This will add `Lung` and `B cells` to the unique cell type categories
    // if there are multiple cell types for the same organ or cell type
    cellTypeParts.forEach((part) => {
      cellTypeCategories[part] = (cellTypeCategories[part] || 0) + 1;
    });
  });
  // Remove categories with a weight of 1 (i.e. those that are not shared between cell types)
  const filteredCategories = Object.entries(cellTypeCategories)
    .filter(([, weight]) => weight > 1)
    .map(([cellType]) => cellType);

  const formattedCellTypes = cellTypes.map((c) => formatCellTypeName(c));

  // Sort the individual cell types to the front of the list, followed by the "cell type in organ" categories alphabetically
  filteredCategories.sort((a, b) => {
    const aIsIndividual = formattedCellTypes.includes(a) ? 0 : 1;
    const bIsIndividual = formattedCellTypes.includes(b) ? 0 : 1;
    if (aIsIndividual !== bIsIndividual) {
      return aIsIndividual - bIsIndividual;
    }
    return a.localeCompare(b);
  });

  return filteredCategories;
}

/**
 * Map datasets to the categories they belong in order to display the target cell type counts in the UI
 * @param cellTypeCategories The unique cell type categories (e.g. [`lung`, `kidney`, `B cell`, `T cell`, `kidney.B Cell`, `kidney.T cell`, `lung.B cell`, `lung.T cell`])
 * @param cellTypes The cell types to map (e.g. [`lung.B cell`, `lung.T cell`, `kidney.B cell`, `kidney.T cell`])
 * @param data The original dataset results from the API
 * @returns {WrappedDatasetResults} A mapping of cell type categories to datasets
 */
export function mapDatasetsToCellTypeCategories(
  cellTypeCategories: string[],
  cellTypes: string[],
  data: FindDatasetForCellTypeResponse[],
): WrappedDatasetResults {
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
}

interface ProcessGeneQueryResultsArgs {
  data?: DatasetsForGenesResponse;
  genes: string[];
  pathwayName?: string;
  participants: string[];
}

interface ProcessedGeneQueryResults {
  categorizedResults: UnwrappedDatasetResults;
  emptyResults: string[];
  order: string[];
  datasetToGeneMap: Record<string, Set<string>>;
  noResults: boolean;
}

/**
 * Categorize the initial results of a gene query to separate genes with results from those without results.
 * This function also mutates the datasetToGeneMap to include the genes for each dataset.
 * @param originalResults The original dataset results from the API
 * @param genes The genes to categorize
 * @param datasetToGeneMap A map of datasets to genes
 * @returns {object} An object containing a map of the categorized results and a list of empty results
 */
function categorizeGeneResults(
  originalResults: Record<string, string[]>,
  genes: string[],
  datasetToGeneMap: Record<string, Set<string>> = {},
): { categorizedResults: UnwrappedDatasetResults; emptyResults: string[] } {
  const categorizedResults: UnwrappedDatasetResults = {};
  const emptyResults: string[] = [];

  genes.forEach((gene) => {
    const datasets = originalResults[gene] ?? [];
    if (datasets.length > 0) {
      categorizedResults[gene] = datasets;
      // Add the gene to the datasetToGeneMap
      datasets.forEach((dataset) => {
        datasetToGeneMap[dataset] = datasetToGeneMap[dataset] || new Set();
        datasetToGeneMap[dataset].add(gene);
      });
    } else {
      emptyResults.push(gene);
    }
  });

  return { categorizedResults, emptyResults };
}

/**
 * Further refine the results of the gene query to group pathways if applicable.
 * WARNING: this function mutates the categorizedResults, emptyResults, and order arrays.
 * @param pathwayName The name of the pathway (if applicable)
 * @param participants The participants in the pathway (if applicable)
 * @param categorizedResults The categorized results from the initial query
 * @param emptyResults The list of empty results from the initial query
 * @param order The order in which results should be displayed
 * @returns {void} This function does not return anything, but mutates the categorizedResults, emptyResults, and order arrays if applicable.
 */
function handleGenePathwayResults(
  pathwayName: string | undefined,
  participants: string[],
  categorizedResults: UnwrappedDatasetResults,
  emptyResults: string[],
  order: string[],
) {
  if (pathwayName && participants.length > 0) {
    const unionKey = `Any Genes in ${pathwayName}`;
    const intersectionKey = `All Genes in ${pathwayName}`;

    // Create the union of all results for genes in the selected pathway.
    const pathwayResults = new Set<string>();
    participants.forEach((participant) => {
      const datasets = categorizedResults[participant] ?? [];
      datasets.forEach((dataset) => {
        pathwayResults.add(dataset);
      });
    });

    // If there are no datasets in the union, add the union key to the empty results and end the function
    if (pathwayResults.size === 0) {
      emptyResults.push(unionKey);
      return;
    }

    // Otherwise, since the union contains at least one dataset, add it to the categorized results and the key order.
    categorizedResults[unionKey] = Array.from(pathwayResults);
    order.push(unionKey);

    // We check for an intersection of the genes in the same pathway
    // by checking if any datasets in the union are in the results for each participant
    const intersectionResults = new Set<string>();
    pathwayResults.forEach((dataset) => {
      const isInAll = participants.every((participant) => {
        const participantDatasets = categorizedResults[participant] ?? [];
        return participantDatasets.includes(dataset);
      });
      if (isInAll) {
        intersectionResults.add(dataset);
      }
    });
    // If the intersection is not empty, add it to the categorized results and the key order
    if (intersectionResults.size !== 0) {
      categorizedResults[intersectionKey] = Array.from(intersectionResults);
      order.push(intersectionKey);
    }
  }
}

const noDataResults: ProcessedGeneQueryResults = {
  categorizedResults: {},
  emptyResults: [],
  order: [],
  datasetToGeneMap: {},
  noResults: true,
};

/**
 * Process the results of a gene query
 * @param data The original dataset results from the API
 * @param genes The genes to process
 * @param name The name of the pathway (if applicable)
 * @param participants The participants in the pathway (if applicable)
 * @returns {object} An object containing the categorized results, a list of empty results, the order in which results should be displayed, and dataset to gene map
 */
export function processGeneQueryResults({
  data,
  genes,
  pathwayName,
  participants,
}: ProcessGeneQueryResultsArgs): ProcessedGeneQueryResults {
  if (!data) {
    return noDataResults;
  }

  const order: string[] = [];
  const datasetToGeneMap: Record<string, Set<string>> = {};

  // Extract the original results from the API response
  const { findDatasets: originalResults } = data;

  // Categorize empty and non-empty results
  const { categorizedResults, emptyResults } = categorizeGeneResults(originalResults, genes, datasetToGeneMap);

  // Populate the categorized results, empty results, and order arrays with the pathway results if applicable
  handleGenePathwayResults(pathwayName, participants, categorizedResults, emptyResults, order);

  // Add the individual genes to the key order after the pathway results
  // This guarantees that the pathway results are displayed first
  // and the individual genes are displayed in the order they were provided
  Object.keys(categorizedResults).forEach((key) => {
    if (!order.includes(key)) {
      order.push(key);
    }
  });

  const noResults = emptyResults.length === genes.length;

  return {
    categorizedResults,
    emptyResults,
    order,
    datasetToGeneMap,
    noResults,
  };
}
