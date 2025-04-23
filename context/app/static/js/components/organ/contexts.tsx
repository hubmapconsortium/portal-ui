import React, { createContext, useContext, PropsWithChildren } from 'react';
import { OrganFile } from 'js/components/organ/types';

interface OrganContextProps {
  organ: OrganFile;
}

export const OrganContext = createContext<OrganContextProps | null>(null);

export const useOrganContext = () => {
  const context = useContext(OrganContext);
  if (!context) {
    throw new Error('Missing OrganContextProvider');
  }
  return context;
};

export function OrganContextProvider({ children, ...props }: PropsWithChildren<OrganContextProps>) {
  return <OrganContext.Provider value={props}>{children}</OrganContext.Provider>;
}
