import React, { useMemo } from 'react';

import { useCellTypeOntologyDetail, useGeneOntologyDetails } from 'js/hooks/useUBKG';
import useSearchData from 'js/hooks/useSearchData';
import { isError } from 'js/helpers/is-error';
import Skeleton from '@mui/material/Skeleton';
import useSCFindIDAdapter from 'js/api/scfind/useSCFindIDAdapter';
import { SCFindModality } from 'js/components/cells/MolecularDataQueryForm/types';
import {
  useCellTypesDetailPageContext,
  useCellTypeMarkersData,
  useCellTypeDatasetsData,
} from './CellTypesDetailPageContext';
import { Entity } from '../types';

/**
 * Helper function for fetching the current page's cell type info from the UBKG.
 * @returns {CellTypeInfoResponse} The cell type info for the current page.
 */
export const useCellTypeInfo = () => {
  const { clid } = useCellTypesDetailPageContext();
  return useCellTypeOntologyDetail(clid);
};

/**
 * Extracts the cell type name from a list of cell types.
 * If the list is empty, it returns an empty string.
 * The list can contain multiple variants of the same cell type across different organs,
 * in the format `<organ>.<cell_type>:<variant>`.
 * The variants are usually different developmental stages or states of the same cell type.
 * @param cellTypes
 * @returns {object} An object containing the cell type name, organs, and variants for each organ.
 */
export function useExtractedCellTypeInfo() {
  // name/organs/variants are derived once in the provider from the page aggregate's cell types.
  const { name, organs, variants } = useCellTypesDetailPageContext();
  return useMemo(() => ({ name, organs, variants }), [name, organs, variants]);
}

/**
 * Helper function for fetching the current page's cell type name from the UBKG.
 * @returns {string} The cell type name for the current page.
 */
export const useCellTypeName = () => {
  return useExtractedCellTypeInfo().name;
};

export const useCellTypeOrgans = () => {
  return useExtractedCellTypeInfo().organs;
};

export const useCellTypeVariants = () => {
  return useExtractedCellTypeInfo().variants;
};

export const useCellTypeVariantsForOrgan = (organ: string) => {
  const { variants } = useExtractedCellTypeInfo();
  return variants[organ] ?? [];
};

interface IndexedDatasetsForCellTypeAggs {
  datasetTypes: {
    buckets: {
      key: string;
      doc_count: number;
    }[];
  };
  organs: {
    buckets: {
      key: string;
      doc_count: number;
    }[];
  };
}

export function useIndexedDatasetsForCellType({
  cellTypes,
  trackingInfo,
}: {
  cellTypes: string[];
  trackingInfo?: { category: string; label: string };
}) {
  // Datasets-per-cell-type come from the page aggregate (CellTypesDetailPageContext).
  const { datasetsForCellTypes, isLoading: isLoadingScFind } = useCellTypeDatasetsData();

  const scFindIds = useMemo(
    () => cellTypes.flatMap((cellType) => datasetsForCellTypes[cellType]?.datasets ?? []),
    [cellTypes, datasetsForCellTypes],
  );

  const ids = useSCFindIDAdapter(scFindIds);

  const query =
    ids.length > 0
      ? {
          bool: {
            must: [
              {
                ids: {
                  values: ids,
                },
              },
            ],
          },
        }
      : undefined;

  const { searchData, isLoading: isLoadingSearchApi } = useSearchData<Entity, IndexedDatasetsForCellTypeAggs>({
    query,
    aggs: {
      datasetTypes: {
        terms: {
          field: 'raw_dataset_type.keyword',
          order: {
            _term: 'asc',
          },
          size: 10000,
        },
      },
      organs: {
        terms: {
          field: 'origin_samples_unique_mapped_organs.keyword',
          order: {
            _term: 'asc',
          },
          size: 10000,
        },
      },
    },

    size: 10000,
    _source: ['hubmap_id'],
  });

  const datasetUUIDs = searchData?.hits?.hits.map((h) => h._id) ?? [];
  const hubmapIds = searchData?.hits?.hits.map((h) => h._source!.hubmap_id) ?? [];

  const datasetTypes = searchData?.aggregations?.datasetTypes?.buckets ?? [];
  const organs = searchData?.aggregations?.organs?.buckets ?? [];

  return {
    datasets: hubmapIds,
    datasetUUIDs,
    isLoadingDatasets: isLoadingScFind || isLoadingSearchApi,
    organs,
    datasetTypes,
    trackingInfo,
    scFindParams: {
      scFindOnly: true,
    },
  };
}

export function useIndexedDatasetsForCellTypePage() {
  const { cellTypes, trackingInfo } = useCellTypesDetailPageContext();
  return useIndexedDatasetsForCellType({ cellTypes, trackingInfo });
}

export function useBiomarkersTableData(modality?: SCFindModality) {
  // Marker genes come from the page aggregate (CellTypesDetailPageContext), per modality.
  const { markers, isLoading } = useCellTypeMarkersData(modality);

  const geneIds = useMemo(() => markers.map(({ genes }) => genes), [markers]);

  // Fetch gene descriptions for the gene IDs
  const { data: descriptions, isLoading: isLoadingDescriptions } = useGeneOntologyDetails(geneIds);

  const restructuredDescriptions = useMemo(() => {
    if (!descriptions) {
      return {};
    }
    const unwrappedDescriptions = descriptions.flat();
    return unwrappedDescriptions.reduce<Record<string, string>>((acc, entry, idx) => {
      if (isError(entry)) {
        return acc;
      }
      // Handle cases where approved_symbol or summary is missing (where gene description is not available)
      if (!entry.approved_symbol || !entry.summary) {
        return acc;
      }
      const { summary } = entry;
      acc[geneIds[idx]] = summary;
      return acc;
    }, {});
  }, [descriptions, geneIds]);

  const rows = useMemo(() => {
    return markers.map(({ genes: geneName, precision, recall, f1 }) => ({
      genes: geneName,
      precision,
      recall,
      f1,
      description:
        restructuredDescriptions[geneName] ?? (isLoadingDescriptions ? <Skeleton /> : 'No description available.'),
    }));
  }, [markers, isLoadingDescriptions, restructuredDescriptions]);
  return { isLoading, isLoadingDescriptions, rows };
}
