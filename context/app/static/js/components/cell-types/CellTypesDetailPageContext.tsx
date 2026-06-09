import React, { PropsWithChildren, useMemo, useContext as useOptionalContext } from 'react';
import { createContext, useContext } from 'js/helpers/context';
import useCellTypeDetailData, { CellTypeMarker, DatasetsForCellType } from 'js/api/scfind/useCellTypeDetailData';
import { extractCellTypesInfo } from 'js/api/scfind/utils';
import { SCFindModality } from 'js/components/cells/MolecularDataQueryForm/types';

interface CellTypesContextProps {
  cellId: string;
}

interface CellTypesContextType extends CellTypesContextProps {
  clid: string; // CLID derived from cellId
  cellTypes: string[]; // List of cell types associated with the cellId
  name: string; // Name of the cell type
  organs: string[]; // List of organs associated with the cell type
  variants: Record<string, string[]>; // Variants associated with each organ
  // RNA + ATAC marker genes and per-cell-type datasets (from the page aggregate), for the
  // biomarker and dataset RNAseq/ATACseq modality tabs.
  markers: CellTypeMarker[];
  markersAtac: CellTypeMarker[];
  datasetsForCellTypes: Record<string, DatasetsForCellType>;
  datasetsForCellTypesAtac: Record<string, DatasetsForCellType>;
  isLoading: boolean;
  error: unknown;
  trackingInfo: {
    category: string; // Category for tracking events
    label: string; // Label prefix for tracking events
  };
}

const CellTypesContext = createContext<CellTypesContextType>('CellTypesContext');

export default function CellTypesProvider({ children, cellId }: PropsWithChildren<CellTypesContextProps>) {
  // Single aggregate fetch for the page's scfind data; non-blocking so children show skeletons
  // while `isLoading`.
  const { data, isLoading, error } = useCellTypeDetailData(cellId);
  const cellTypes = useMemo(() => data?.cell_types ?? [], [data]);
  const { name, organs, variants } = extractCellTypesInfo(cellTypes);
  const value = useMemo(
    () => ({
      cellId,
      clid: cellId.startsWith('CL:') ? cellId.split(':')[1] : cellId, // Safely derive the numeric part of the cellId from the format 'CL:0000236'
      cellTypes,
      name,
      organs,
      variants,
      markers: data?.markers ?? [],
      markersAtac: data?.markers_atac ?? [],
      datasetsForCellTypes: data?.datasets_for_cell_types ?? {},
      datasetsForCellTypesAtac: data?.datasets_for_cell_types_atac ?? {},
      isLoading,
      error,
      trackingInfo: {
        category: 'Cell Type Detail Page',
        label: name,
      },
    }),
    [cellId, cellTypes, name, organs, variants, data, isLoading, error],
  );
  return <CellTypesContext.Provider value={value}>{children}</CellTypesContext.Provider>;
}

export const useCellTypesDetailPageContext = () => useContext(CellTypesContext);
export const useOptionalCellTypesDetailPageContext = () => useOptionalContext(CellTypesContext);

/** Biomarkers slice of the cell-type-detail aggregate for a modality (RNA when `undefined`). */
export const useCellTypeMarkersData = (modality?: SCFindModality) => {
  const { markers, markersAtac, isLoading } = useCellTypesDetailPageContext();
  return { markers: modality === 'ATAC' ? markersAtac : markers, isLoading };
};

/** Datasets slice of the cell-type-detail aggregate for a modality (RNA when `undefined`). */
export const useCellTypeDatasetsData = (modality?: SCFindModality) => {
  const { datasetsForCellTypes, datasetsForCellTypesAtac, isLoading } = useCellTypesDetailPageContext();
  return {
    datasetsForCellTypes: modality === 'ATAC' ? datasetsForCellTypesAtac : datasetsForCellTypes,
    isLoading,
  };
};
