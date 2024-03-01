import { useMemo, useState } from 'react';

import { useEventCallback } from '@mui/material/utils';
import { SelectChangeEvent } from '@mui/material/Select';

import { useCellTypeOntologyDetail, CellTypeBiomarkerInfo } from 'js/hooks/useUBKG';
import { useFeatureDetails } from 'js/hooks/useCrossModalityApi';
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
  const { cellId } = useCellTypesContext();
  const cellIdWithoutPrefix = cellId.replace('CL:', '');
  return useCellTypeOntologyDetail(cellIdWithoutPrefix);
};

/**
 * Helper function for fetching the current page's cell type name from the UBKG.
 * @returns {string} The cell type name for the current page.
 */
export const useCellTypeName = () => {
  const { data } = useCellTypeInfo();
  return data?.cell_type.name;
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
