import React, { PropsWithChildren, useMemo, useContext as useOptionalContext } from 'react';
import { createContext, useContext } from 'js/helpers/context';
import useCLIDToLabel from 'js/api/scfind/useCLIDToLabel';
import { extractCellTypesInfo } from './utils';

interface CellTypesContextProps {
  cellId: string;
}

interface CellTypesContextType extends CellTypesContextProps {
  clid: string; // CLID derived from cellId
  cellTypes: string[]; // List of cell types associated with the cellId
  name: string; // Name of the cell type
  organs: string[]; // List of organs associated with the cell type
  variants: Record<string, string[]>; // Variants associated with each organ
}

const CellTypesContext = createContext<CellTypesContextType>('CellTypesContext');

export default function CellTypesProvider({ children, cellId }: PropsWithChildren<CellTypesContextProps>) {
  const { data: { cell_types: cellTypes } = { cell_types: [] } } = useCLIDToLabel({ clid: cellId });
  const { name, organs, variants } = extractCellTypesInfo(cellTypes);
  const value = useMemo(
    () => ({
      cellId,
      clid: cellId.startsWith('CL:') ? cellId.split(':')[1] : cellId, // Safely derive the numeric part of the cellId from the format 'CL:0000236'
      cellTypes: cellTypes ?? [],
      name,
      organs,
      variants,
    }),
    [cellId, cellTypes, name, organs, variants],
  );
  return <CellTypesContext.Provider value={value}>{children}</CellTypesContext.Provider>;
}

export const useCellTypesContext = () => useContext(CellTypesContext);
export const useOptionalCellTypesContext = () => useOptionalContext(CellTypesContext);
