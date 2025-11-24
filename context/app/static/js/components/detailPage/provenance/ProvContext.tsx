import React, { PropsWithChildren, useMemo, useState, useCallback } from 'react';

import { createContext, useContext } from 'js/helpers/context';

interface ProvContextType {
  uuids: string[];
  addUuids: (newUuids: string[]) => void;
}

export const ProvContext = createContext<ProvContextType>('ProvContext');

export const useProvContext = () => useContext(ProvContext);

interface ProvContextProviderProps {
  initialUuids: string[];
}

export function ProvContextProvider({ children, initialUuids }: PropsWithChildren<ProvContextProviderProps>) {
  const [uuids, setUuids] = useState<string[]>(initialUuids);

  const addUuids = useCallback((newUuids: string[]) => {
    setUuids((prev) => {
      const uniqueUuids = [...new Set([...prev, ...newUuids])];
      return uniqueUuids;
    });
  }, []);

  const value = useMemo(
    () => ({
      uuids,
      addUuids,
    }),
    [uuids, addUuids],
  );

  return <ProvContext.Provider value={value}>{children}</ProvContext.Provider>;
}
