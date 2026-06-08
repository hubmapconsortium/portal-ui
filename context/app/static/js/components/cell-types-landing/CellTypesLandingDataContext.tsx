import React, { PropsWithChildren, useMemo } from 'react';
import { createContext, useContext } from 'js/helpers/context';
import useCellTypesLandingData from 'js/api/scfind/useCellTypesLandingData';

interface CellTypesLandingDataContextType {
  cellTypeNames: string[]; // RNA cell type names ("organ.cellType"), 'other' filtered server-side
  cellTypeNamesAtac: string[]; // ATAC cell type names
  organs: string[]; // deduped RNA organs
  isLoading: boolean;
  isValidating: boolean;
  error: unknown;
}

const CellTypesLandingDataContext = createContext<CellTypesLandingDataContextType>('CellTypesLandingDataContext');

/**
 * Fetches the Cell Types landing aggregate once and shares it with the page, panel list, and
 * panel-item header. Must wrap *outside* CellTypesSearchProvider, whose initial organ state is
 * seeded from this data.
 */
export default function CellTypesLandingDataProvider({ children }: PropsWithChildren) {
  const { data, isLoading, isValidating, error } = useCellTypesLandingData();
  const value = useMemo(
    () => ({
      cellTypeNames: data?.cell_type_names ?? [],
      cellTypeNamesAtac: data?.cell_type_names_atac ?? [],
      organs: data?.organs ?? [],
      isLoading,
      isValidating,
      error,
    }),
    [data, isLoading, isValidating, error],
  );
  return <CellTypesLandingDataContext.Provider value={value}>{children}</CellTypesLandingDataContext.Provider>;
}

export const useCellTypesLandingDataContext = () => useContext(CellTypesLandingDataContext);
