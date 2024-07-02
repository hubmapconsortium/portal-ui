import { useContext, createContext } from 'js/helpers/context';
import { Entity } from './types';

// TODO: Continue populating these types as we find more of the uses of the flask data and app contexts

interface FlaskDataContextType {
  redirected_from: string;
  entity: Entity; // Update to handle different entities.
  [key: string]: unknown;
  title: string; // preview page title
  vis_lifted_uuid?: string;
}

export const FlaskDataContext = createContext<FlaskDataContextType>('FlaskDataContext');

/**
 * Access the flask data context.
 * For the time being, all non-listed keys will be typed as `unknown`.
 * If a key is `unknown`, TS will complain if you try to use it without
 * type-checking it or adding it to the context's type.
 * If you find that you're unable to use a key, please add it to the ContextType above.
 * @returns FlaskDataContextType - The contents of the `flask_data` object passed from the server
 */
export const useFlaskDataContext = () => useContext(FlaskDataContext);

interface AppContextType {
  assetsEndpoint: string;
  entityEndpoint: string;
  elasticsearchEndpoint: string;
  groupsToken: string;
  workspacesToken: string;
  workspacesEndpoint: string;
  userTemplatesEndpoint: string;
  ubkgEndpoint: string;
  protocolsClientToken: string;
  isAuthenticated: boolean;
  isWorkspacesUser: boolean;
  isHubmapUser: boolean;
  userEmail: string;
  [key: string]: unknown;
}

export const AppContext = createContext<AppContextType>('AppContext');

/**
 * Access the App data context.
 * For the time being, all non-listed keys will be typed as `unknown`.
 * If a key is `unknown`, TS will complain if you try to use it without
 * type-checking it or adding it to the context's type.
 * If you find that you're unable to use a key, please add it to the ContextType above.
 * @returns AppContextType - The app configuration object passed from the server
 */
export const useAppContext = () => useContext(AppContext);
