import { useContext, createContext } from 'react';

// TODO: Continue specifying shapes of contexts as we start using them in our TS files
const FlaskDataContext = createContext<unknown>({});

type AppContextType = {
  assetsEndpoint: string;
  groupsToken: string;
};
const AppContext = createContext<AppContextType>({
  assetsEndpoint: '',
  groupsToken: '',
});

FlaskDataContext.displayName = 'FlaskDataContext';

export { FlaskDataContext, AppContext };
export const useAppContext = () => useContext(AppContext);
export const useFlaskDataContext = () => useContext(FlaskDataContext);
