import { useMemo, useState } from 'react';

import { useEventCallback } from '@mui/material/utils';
import { SelectChangeEvent } from '@mui/material/Select';

import { useCellTypeOntologyDetail, CellTypeBiomarkerInfo } from 'js/hooks/useUBKG';
import { useFeatureDetails } from 'js/hooks/useCrossModalityApi';
import useCLIDToLabel from 'js/api/scfind/useCLIDToLabel';
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

/**
 * Extracts the cell type name from a list of cell types.
 * If the list is empty, it returns an empty string.
 * The list can contain multiple variants of the same cell type across different organs,
 * in the format `<organ>.<cell_type>:<variant>`.
 * The variants are usually different developmental stages or states of the same cell type.
 * @param cellTypes
 * @returns {object} An object containing the cell type name, organs, and variants for each organ.
 */
function useExtractedCellTypeInfo() {
  const { cellId } = useCellTypesContext();
  const { data: { cell_types: cellTypes } = { cell_types: [] } } = useCLIDToLabel({ clid: cellId });
  return useMemo(() => {
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
  }, [cellTypes]);
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
