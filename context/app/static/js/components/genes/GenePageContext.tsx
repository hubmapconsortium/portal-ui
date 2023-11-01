import React, { PropsWithChildren, useMemo } from 'react';
import { createContext, useContext } from 'js/helpers/context';

interface GenePageContext {
  geneSymbol: string;
}

const GenePageContext = createContext<GenePageContext>('GenePageContext');

export default function GenePageProvider({ children, geneSymbol }: PropsWithChildren<GenePageContext>) {
  const value = useMemo(() => ({ geneSymbol }), [geneSymbol]);
  return <GenePageContext.Provider value={value}>{children}</GenePageContext.Provider>;
}

export const useGenePageContext = () => useContext(GenePageContext);
