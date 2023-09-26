import React, { PropsWithChildren, useRef } from 'react';
import PropTypes from 'prop-types';

import { useStore as useZustandStore } from 'zustand';
import { createStore } from './store';
import { createContext, useContext } from 'js/helpers/context';

type DropdownMenuContextType = ReturnType<typeof createStore>;

const DropdownMenuContext = createContext<DropdownMenuContextType>('DropdownMenuContext');

type DropdownMenuProviderProps = PropsWithChildren<{
  isOpenToStart?: boolean;
}>;

function DropdownMenuProvider({ children, isOpenToStart = false }: DropdownMenuProviderProps) {
  const ref = useRef<HTMLDivElement>(null); // ref must be passed to store and not created inside
  const store = useRef<DropdownMenuContextType>();
  if (!store.current) {
    store.current = createStore(isOpenToStart, ref);
  }
  return <DropdownMenuContext.Provider value={store.current}>{children}</DropdownMenuContext.Provider>;
}

DropdownMenuProvider.propTypes = {
  isOpenToStart: PropTypes.bool,
};

DropdownMenuProvider.defaultProps = {
  isOpenToStart: false,
};

export const useDropdownMenuStore = () => useZustandStore(useContext(DropdownMenuContext));

export default DropdownMenuProvider;
