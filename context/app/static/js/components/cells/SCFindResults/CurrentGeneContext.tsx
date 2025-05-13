import { useContext as useContextReact } from 'react';
import { createContext, useContext } from 'js/helpers/context';

type CurrentGeneContextType = string;

const CurrentGeneContext = createContext<CurrentGeneContextType>('CurrentGeneContext');

export const CurrentGeneContextProvider = CurrentGeneContext.Provider;

export const useCurrentGeneContext = () => useContext(CurrentGeneContext);

export const useOptionalGeneContext = () => {
  return useContextReact(CurrentGeneContext);
};
