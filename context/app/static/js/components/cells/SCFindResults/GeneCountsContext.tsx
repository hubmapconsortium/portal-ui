import { createContext, useContext } from 'react';

// Map of gene name to map of dataset ID to count
type GeneCountsContextType = Record<string, Record<string, number>>;

const GeneCountsContext = createContext<GeneCountsContextType>({});

export const GeneCountsContextProvider = GeneCountsContext.Provider;

export const useGeneCountsContext = () => useContext(GeneCountsContext);
