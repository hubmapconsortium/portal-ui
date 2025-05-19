import { createContext, useContext } from 'js/helpers/context';

type MatchingGeneContextType = Record<string, Set<string>>;

const MatchingGeneContext = createContext<MatchingGeneContextType>('MatchingGeneContext');

export const MatchingGeneContextProvider = MatchingGeneContext.Provider;

export const useMatchingGeneContext = () => useContext(MatchingGeneContext);
