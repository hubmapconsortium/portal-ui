import React, { PropsWithChildren, useMemo, useContext as useOptionalContext } from 'react';
import { createContext, useContext } from 'js/helpers/context';
import useCellTypeDetailData, { CellTypeMarker, DatasetsForCellType } from 'js/api/scfind/useCellTypeDetailData';
import { extractCellTypesInfo } from 'js/api/scfind/utils';

interface CellTypesContextProps {
  cellId: string;
}

interface CellTypesContextType extends CellTypesContextProps {
  clid: string; // CLID derived from cellId
  cellTypes: string[]; // List of cell types associated with the cellId
  name: string; // Name of the cell type
  organs: string[]; // List of organs associated with the cell type
  variants: Record<string, string[]>; // Variants associated with each organ
  markers: CellTypeMarker[]; // Marker genes for the cell type (from the page aggregate)
  datasetsForCellTypes: Record<string, DatasetsForCellType>; // Datasets per cell type variant
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
      datasetsForCellTypes: data?.datasets_for_cell_types ?? {},
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

/** Biomarkers slice of the cell-type-detail aggregate (cellTypeMarkers findGeneSignatures). */
export const useCellTypeMarkersData = () => {
  const { markers, isLoading } = useCellTypesDetailPageContext();
  return { markers, isLoading };
};

/** Datasets slice of the cell-type-detail aggregate (per-cell-type findDatasetForCellType). */
export const useCellTypeDatasetsData = () => {
  const { datasetsForCellTypes, isLoading } = useCellTypesDetailPageContext();
  return { datasetsForCellTypes, isLoading };
};
