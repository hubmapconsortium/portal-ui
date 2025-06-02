import React, { PropsWithChildren, useMemo } from 'react';
import { createContext, useContext } from 'js/helpers/context';

interface GenePageContextProps {
  geneSymbol: string;
}
interface GenePageContext extends GenePageContextProps {
  geneSymbolUpper: string;
}

const GenePageContext = createContext<GenePageContext>('GenePageContext');

export default function GenePageProvider({ children, geneSymbol }: PropsWithChildren<GenePageContextProps>) {
  const value = useMemo(() => ({ geneSymbol, geneSymbolUpper: geneSymbol.toLocaleUpperCase() }), [geneSymbol]);
  return <GenePageContext.Provider value={value}>{children}</GenePageContext.Provider>;
}

export const useGenePageContext = () => useContext(GenePageContext);
