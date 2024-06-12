import { createContext, useContext } from "js/helpers/context";
import React, { PropsWithChildren, useState } from "react";

interface HeroTabContextProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
}

export const HeroTabContext = createContext<HeroTabContextProps>('HeroTabContext');
export const useHeroTabContext = () => useContext(HeroTabContext);
export function HeroTabContextProvider({ children, activeTab, setActiveTab }: PropsWithChildren<HeroTabContextProps>) {
  return (
    <HeroTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </HeroTabContext.Provider>
  );
}