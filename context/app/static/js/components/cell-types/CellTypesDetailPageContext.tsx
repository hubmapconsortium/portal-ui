import React, { PropsWithChildren, useMemo, useContext as useOptionalContext } from 'react';
import { createContext, useContext } from 'js/helpers/context';
import useCLIDToLabel from 'js/api/scfind/useCLIDToLabel';
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
  trackingInfo: {
    category: string; // Category for tracking events
    label: string; // Label prefix for tracking events
  };
}

const CellTypesContext = createContext<CellTypesContextType>('CellTypesContext');

export default function CellTypesProvider({ children, cellId }: PropsWithChildren<CellTypesContextProps>) {
  const { data: cellTypes = [] } = useCLIDToLabel({ clid: cellId });
  const { name, organs, variants } = extractCellTypesInfo(cellTypes);
  const value = useMemo(
    () => ({
      cellId,
      clid: cellId.startsWith('CL:') ? cellId.split(':')[1] : cellId, // Safely derive the numeric part of the cellId from the format 'CL:0000236'
      cellTypes: cellTypes ?? [],
      name,
      organs,
      variants,
      trackingInfo: {
        category: 'Cell Type Detail Page',
        label: `${name}`,
      },
    }),
    [cellId, cellTypes, name, organs, variants],
  );
  return <CellTypesContext.Provider value={value}>{children}</CellTypesContext.Provider>;
}

export const useCellTypesDetailPageContext = () => useContext(CellTypesContext);
export const useOptionalCellTypesDetailPageContext = () => useOptionalContext(CellTypesContext);
