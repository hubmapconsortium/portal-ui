import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useContext, createContext } from 'js/helpers/context';

type InitialHashContextType = string | undefined;

export const InitialHashContext = createContext<InitialHashContextType>('InitialHashContext');
export function InitialHashContextProvider({ children }: PropsWithChildren) {
  const [initialHash, setInitialHash] = useState<string>('');
  useEffect(() => {
    setInitialHash(window.location.hash);
  }, []);
  return <InitialHashContext.Provider value={initialHash}>{children}</InitialHashContext.Provider>;
}

/**
 * Access the initial hash of the page when it's first loaded.
 * This is used to scroll to the correct lazy-loaded section when the page is loaded.
 * @returns the initial hash of the page when it's first loaded
 */
export const useInitialHashContext = () => useContext(InitialHashContext);
