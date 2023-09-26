import React, { PropsWithChildren, useRef } from 'react';

import { useStore as useZustandStore } from 'zustand';
import { AccordionStepsState, createStore } from './store';
import { createContext, useContext } from 'js/helpers/context';

type SearchConfigContextType = ReturnType<typeof createStore>;

const AccordionStepsContext = createContext<SearchConfigContextType>('SearchConfigContext');

type AccordionStepsProviderProps = PropsWithChildren<
  Pick<AccordionStepsState, 'stepsLength'> & {
    initialState?: Partial<AccordionStepsState>;
  }
>;

function AccordionStepsProvider({ children, ...rest }: AccordionStepsProviderProps) {
  const store = useRef<SearchConfigContextType>();
  if (!store.current) {
    store.current = createStore({ ...rest });
  }
  return <AccordionStepsContext.Provider value={store.current}>{children}</AccordionStepsContext.Provider>;
}

const useAccordionStepsStore = () => useZustandStore(useContext(AccordionStepsContext));

export { AccordionStepsProvider, useAccordionStepsStore };
