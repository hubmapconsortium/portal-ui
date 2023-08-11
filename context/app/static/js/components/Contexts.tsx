import { useContext, createContext } from 'js/helpers/context';

// TODO: Continue populating these types as we find more of the uses of the flask data and app contexts

type FlaskDataContextType = {
  redirected_from: string;
  [key: string]: unknown;
};

const FlaskDataContext = createContext<FlaskDataContextType>('FlaskDataContext');

type AppContextType = {
  assetsEndpoint: string;
  groupsToken: string;
  [key: string]: unknown;
};

const AppContext = createContext<AppContextType>('AppContext');

export { FlaskDataContext, AppContext };

/**
 * Access the App data context.
 * For the time being, all non-listed keys will be typed as `unknown`.
 * If a key is `unknown`, TS will complain if you try to use it without
 * type-checking it or adding it to the context's type.
 * If you find that you're unable to use a key, please add it to the ContextType above.
 * @returns AppContextType - The app configuration object passed from the server
 */
export const useAppContext = () => useContext(AppContext);

/**
 * Access the flask data context.
 * For the time being, all non-listed keys will be typed as `unknown`.
 * If a key is `unknown`, TS will complain if you try to use it without
 * type-checking it or adding it to the context's type.
 * If you find that you're unable to use a key, please add it to the ContextType above.
 * @returns FlaskDataContextType - The contents of the `flask_data` object passed from the server
 */
export const useFlaskDataContext = () => useContext(FlaskDataContext);
