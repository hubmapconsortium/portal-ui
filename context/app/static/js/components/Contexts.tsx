import { useContext, createContext } from 'js/helpers/context';

// TODO: Continue populating these types as we find more of the uses of the flask data and app contexts

type DagProvenanceType =
  | {
      origin: string;
    }
  | {
      name: string;
    };

export interface Entity {
  entity_type: string;
  uuid: string;
  hubmap_id: string;
  [key: string]: unknown;
}

export interface Donor extends Entity {
  entity_type: 'Donor';
  mapped_metadata?: Record<string, string>;
}

export interface Sample extends Entity {
  entity_type: 'Sample';
  metadata?: Record<string, string>;
}

export interface Dataset extends Entity {
  entity_type: 'Dataset';
  processing: 'raw' | 'processed';
  assay_display_name: string;
  is_component?: boolean;
  assay_modality: 'single' | 'multiple';
  donor: Donor;
  metadata: {
    dag_provenance_list: DagProvenanceType[];
    [key: string]: unknown;
  };
}

interface FlaskDataContextType {
  redirected_from: string;
  entity: Dataset; // Update to handle different entities.
  [key: string]: unknown;
  title: string; // preview page title
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
  groupsToken: string;
  workspacesToken: string;
  workspacesEndpoint: string;
  userTemplatesEndpoint: string;
  ubkgEndpoint: string;
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
