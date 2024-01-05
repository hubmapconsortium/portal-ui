import React, { useState, useMemo, PropsWithChildren } from 'react';
import { createContext, useContext } from 'js/helpers/context';
import { OrganFile } from 'js/components/organ/types';

interface SelectedOrganContext {
  selectedOrgan: OrganFile | null;
  setSelectedOrgan: (organ: OrganFile) => void;
}

const SelectedOrganContext = createContext<SelectedOrganContext>('Selected Organ Context');

export function useSelectedOrganContext() {
  return useContext(SelectedOrganContext);
}

export default function SelectedOrganContextProvider({ children }: PropsWithChildren) {
  const [selectedOrgan, setSelectedOrgan] = useState<OrganFile | null>(null);

  const value = useMemo(() => {
    return { selectedOrgan, setSelectedOrgan };
  }, [selectedOrgan]);

  return <SelectedOrganContext.Provider value={value}>{children}</SelectedOrganContext.Provider>;
}
