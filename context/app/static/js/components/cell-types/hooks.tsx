import React, { useMemo, useState } from 'react';

import { useEventCallback } from '@mui/material/utils';
import { SelectChangeEvent } from '@mui/material/Select';

import { useCellTypeOntologyDetail, CellTypeBiomarkerInfo, useGeneOntologyDetails } from 'js/hooks/useUBKG';
import { useFeatureDetails } from 'js/hooks/useCrossModalityApi';
import useCLIDToLabel from 'js/api/scfind/useCLIDToLabel';
import useSearchData from 'js/hooks/useSearchData';
import useFindDatasetForCellTypes from 'js/api/scfind/useFindDatasetForCellTypes';
import useCellTypeMarkers from 'js/api/scfind/useCellTypeMarkers';
import { isError } from 'js/helpers/is-error';
import Skeleton from '@mui/material/Skeleton';
import { extractCellTypesInfo } from 'js/api/scfind/utils';
import { useCellTypesDetailPageContext } from './CellTypesDetailPageContext';

/**
 * Helper function for fetching the current cell type's details from the cross-modality API.
 * @returns The datasets, samples, and organs available in HuBMAP for the current cell type.
 */
export const useCellTypeDetails = () => {
  const { cellId } = useCellTypesDetailPageContext();
  const { data, ...rest } = useFeatureDetails('cell-types', cellId);

  return { ...data, ...rest };
};

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
  const { cellId } = useCellTypesDetailPageContext();
  const { data: { cell_types: cellTypes } = { cell_types: [] } } = useCLIDToLabel({ clid: cellId });
  return useMemo(() => extractCellTypesInfo(cellTypes), [cellTypes]);
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

/**
 * Helper function for fetching the current cell type's biomarker info from the UBKG.
 * @returns {string} The cell type definition for the current page.
 */
export const useCellTypeBiomarkers = () => {
  const { data } = useCellTypeInfo();

  const sources = useMemo(() => {
    const biomarkers = data?.biomarkers ?? [];
    return biomarkers
      .map((biomarker) => biomarker.reference)
      .filter((value, index, self) => self.indexOf(value) === index);
  }, [data?.biomarkers]);
  const [selectedSource, setSelectedSource] = useState(sources[0] ?? '');
  if (!selectedSource && sources.length > 0) {
    setSelectedSource(sources[0]);
  }

  const [genes, proteins] = useMemo(() => {
    const genesForSource: CellTypeBiomarkerInfo[] = [];
    const proteinsForSource: CellTypeBiomarkerInfo[] = [];
    data?.biomarkers
      .filter((biomarker) => biomarker.reference === selectedSource)
      .forEach((biomarker) => {
        if (biomarker.biomarker_type === 'gene') {
          genesForSource.push(biomarker);
        } else {
          proteinsForSource.push(biomarker);
        }
      });
    return [genesForSource, proteinsForSource];
  }, [data?.biomarkers, selectedSource]);

  const handleSourceSelection = useEventCallback((event: SelectChangeEvent<string>) => {
    setSelectedSource(event.target.value);
  });

  return { genes, proteins, sources, selectedSource, handleSourceSelection };
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

export function useIndexedDatasetsForCellType() {
  const { cellTypes, trackingInfo } = useCellTypesDetailPageContext();
  const {
    data,
    isLoading: isLoadingScFind,
    ...rest
  } = useFindDatasetForCellTypes({
    cellTypes,
  });

  const hubmapIds = data?.map((d) => d.datasets).flat() ?? [];

  const { searchData, isLoading: isLoadingSearchApi } = useSearchData<unknown, IndexedDatasetsForCellTypeAggs>({
    query: {
      bool: {
        must: [
          {
            terms: {
              'hubmap_id.keyword': hubmapIds,
            },
          },
        ],
      },
    },
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

  const datasetTypes = searchData?.aggregations?.datasetTypes?.buckets ?? [];
  const organs = searchData?.aggregations?.organs?.buckets ?? [];

  return {
    datasets: hubmapIds,
    datasetUUIDs,
    isLoading: isLoadingScFind || isLoadingSearchApi,
    organs,
    datasetTypes,
    trackingInfo,
    ...rest,
  };
}

export function useBiomarkersTableData() {
  const { cellTypes } = useCellTypesDetailPageContext();
  const { data, isLoading } = useCellTypeMarkers({
    cellTypes,
  });

  const geneIds = useMemo(() => {
    if (!data?.findGeneSignatures) {
      return [];
    }
    return data.findGeneSignatures.map(({ genes }) => genes);
  }, [data]);

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
    if (!data?.findGeneSignatures) {
      return [];
    }
    return data.findGeneSignatures.map(({ genes: geneName, precision, recall, f1 }) => ({
      genes: geneName,
      precision,
      recall,
      f1,
      description:
        restructuredDescriptions[geneName] ?? (isLoadingDescriptions ? <Skeleton /> : 'No description available.'),
    }));
  }, [data, isLoadingDescriptions, restructuredDescriptions]);
  return { data, isLoading, isLoadingDescriptions, rows };
}
