import { createContext, useContext } from 'js/helpers/context';
import React, { PropsWithChildren } from 'react';

interface CardGridContextProps extends PropsWithChildren {
  setExpandedCardIndex: (index: number | null) => void;
  expandedCardIndex: number | null;
  cardCount: number;
}

const CardGridContext = createContext<CardGridContextProps>('CardGridContext');

function CardGridContextProvider({ children, ...value }: CardGridContextProps) {
  return <CardGridContext.Provider value={value}>{children}</CardGridContext.Provider>;
}

const useCardGridContext = () => useContext(CardGridContext);

export { CardGridContextProvider, useCardGridContext };
