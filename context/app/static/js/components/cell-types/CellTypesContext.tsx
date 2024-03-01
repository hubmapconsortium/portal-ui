import React, { PropsWithChildren, useMemo } from 'react';
import { createContext, useContext } from 'js/helpers/context';

interface CellTypesContextType {
  cellId: string;
}

const CellTypesContext = createContext<CellTypesContextType>('CellTypesContext');

export default function CellTypesProvider({ children, cellId }: PropsWithChildren<CellTypesContextType>) {
  const value = useMemo(() => ({ cellId }), [cellId]);
  return <CellTypesContext.Provider value={value}>{children}</CellTypesContext.Provider>;
}

export const useCellTypesContext = () => useContext(CellTypesContext);
