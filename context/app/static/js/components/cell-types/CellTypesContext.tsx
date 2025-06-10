import React, { PropsWithChildren, useMemo } from 'react';
import { createContext, useContext } from 'js/helpers/context';

interface CellTypesContextProps {
  cellId: string;
}

interface CellTypesContextType extends CellTypesContextProps {
  clid: string; // CLID derived from cellId
}

const CellTypesContext = createContext<CellTypesContextType>('CellTypesContext');

export default function CellTypesProvider({ children, cellId }: PropsWithChildren<CellTypesContextProps>) {
  const value = useMemo(
    () => ({
      cellId,
      clid: cellId.startsWith('CL:') ? cellId.split(':')[1] : cellId, // Safely derive the numeric part of the cellId from the format 'CL:0000236'
    }),
    [cellId],
  );
  return <CellTypesContext.Provider value={value}>{children}</CellTypesContext.Provider>;
}

export const useCellTypesContext = () => useContext(CellTypesContext);
