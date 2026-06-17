import React, { PropsWithChildren, useMemo } from 'react';

import { createContext, useContext } from 'js/helpers/context';
import useOrganCellTypesData, { OrganCellType } from 'js/api/scfind/useOrganCellTypesData';
import { SCFindModality } from 'js/components/cells/MolecularDataQueryForm/types';
import { useOrganContext } from '../contexts';

interface OrganCellTypesContextType {
  cellTypes: OrganCellType[]; // RNAseq
  cellTypesAtac: OrganCellType[]; // ATACseq
  isLoading: boolean;
  error: unknown;
}

const OrganCellTypesContext = createContext<OrganCellTypesContextType>('OrganCellTypesContext');

/**
 * Provides the organ's cell-types aggregate (both modalities) from a single server-side fetch, so
 * the table's RNAseq/ATACseq tabs and rows render without per-row client requests.
 */
export default function OrganCellTypesProvider({ children }: PropsWithChildren) {
  const { organ } = useOrganContext();
  const { data, isLoading, error } = useOrganCellTypesData(organ.name);
  const value = useMemo(
    () => ({
      cellTypes: data?.cell_types ?? [],
      cellTypesAtac: data?.cell_types_atac ?? [],
      isLoading,
      error,
    }),
    [data, isLoading, error],
  );
  return <OrganCellTypesContext.Provider value={value}>{children}</OrganCellTypesContext.Provider>;
}

export const useOrganCellTypesContext = () => useContext(OrganCellTypesContext);

/** Cell types for a modality (RNAseq when `undefined`). */
export const useOrganCellTypesByModality = (modality?: SCFindModality) => {
  const { cellTypes, cellTypesAtac, isLoading } = useOrganCellTypesContext();
  return { cellTypes: modality === 'ATAC' ? cellTypesAtac : cellTypes, isLoading };
};
