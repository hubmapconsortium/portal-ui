import { useMemo, useState } from 'react';

import { useEventCallback } from '@mui/material/utils';
import { SelectChangeEvent } from '@mui/material/Select';

import { useCellTypeOntologyDetail, CellTypeBiomarkerInfo } from 'js/hooks/useUBKG';
import { useFeatureDetails } from 'js/hooks/useCrossModalityApi';
import useCLIDToLabel from 'js/api/scfind/useCLIDToLabel';
import useSearchData from 'js/hooks/useSearchData';
import useFindDatasetForCellTypes from 'js/api/scfind/useFindDatasetForCellTypes';
import { useCellTypesContext } from './CellTypesContext';

/**
 * Helper function for fetching the current cell type's details from the cross-modality API.
 * @returns The datasets, samples, and organs available in HuBMAP for the current cell type.
 */
export const useCellTypeDetails = () => {
  const { cellId } = useCellTypesContext();
  const { data, ...rest } = useFeatureDetails('cell-types', cellId);

  return { ...data, ...rest };
};

/**
 * Helper function for fetching the current page's cell type info from the UBKG.
 * @returns {CellTypeInfoResponse} The cell type info for the current page.
 */
export const useCellTypeInfo = () => {
  const { clid } = useCellTypesContext();
  return useCellTypeOntologyDetail(clid);
};

export function extractCellTypeInfo(cellType: string) {
  const [organ, typeWithVariant] = cellType.split('.');
  const [name, variant] = typeWithVariant.split(':');
  return { organ, name, variant };
}

export function extractCellTypesInfo(cellTypes: string[]) {
  if (!cellTypes || cellTypes.length === 0) {
    return {
      name: '',
      organs: [],
      variants: {},
    };
  }
  const cellTypeName = cellTypes[0].split(':')[0].split('.')[1];
  const organs = cellTypes.map((cellType) => cellType.split('.')[0]);
  const variants: Record<string, string[]> = {};
  // ensure that each organ has an entry in the variants object
  // and collect unique variants for each organ
  cellTypes.forEach((cellType) => {
    const [organ, typeWithVariant] = cellType.split('.');
    const [, variant] = typeWithVariant.split(':');
    if (!variants[organ]) {
      variants[organ] = [];
    }
    if (variant && !variants[organ].includes(variant)) {
      variants[organ].push(variant);
    }
  });

  return {
    name: cellTypeName,
    organs: Array.from(new Set(organs)), // Ensure unique organs
    variants,
  };
}

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
  const { cellId } = useCellTypesContext();
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
  const { cellTypes } = useCellTypesContext();
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
    ...rest,
  };
}
