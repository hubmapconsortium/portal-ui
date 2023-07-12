import { useContext, createContext } from 'react';

// TODO:
// I tried converting this to a .tsx file, but it made storybook fail; created HMP-250 to track this
// We should continue specifying shapes of contexts as we start using them in our TS files
const FlaskDataContext = createContext({});

/**
 * @typedef AppContextType
 * @property {string} assetsEndpoint
 * @property {string} groupsToken
 */

/**
 * @type {AppContextType}
 */
const AppContext = createContext({});

FlaskDataContext.displayName = 'FlaskDataContext';
AppContext.displayName = 'AppContext';

export { FlaskDataContext, AppContext };

export const useAppContext = () => useContext(AppContext);
export const useFlaskDataContext = () => useContext(FlaskDataContext);
