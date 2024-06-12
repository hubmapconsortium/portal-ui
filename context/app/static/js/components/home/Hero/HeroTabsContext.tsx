import { createContext, useContext } from 'js/helpers/context';
import React, { PropsWithChildren } from 'react';

interface HeroTabContextProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
}

export const HeroTabContext = createContext<HeroTabContextProps>('HeroTabContext');
export const useHeroTabContext = () => useContext(HeroTabContext);
export function HeroTabContextProvider({ children, activeTab, setActiveTab }: PropsWithChildren<HeroTabContextProps>) {
  // eslint-disable-next-line react/jsx-no-constructed-context-values -- No need to wrap this in memo
  return <HeroTabContext.Provider value={{ activeTab, setActiveTab }}>{children}</HeroTabContext.Provider>;
}
