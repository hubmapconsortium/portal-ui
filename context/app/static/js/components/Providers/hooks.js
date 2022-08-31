import { useContext, createContext } from 'react';

const AppContext = createContext({});

function useAppContext() {
  return useContext(AppContext);
}

export { AppContext, useAppContext };
