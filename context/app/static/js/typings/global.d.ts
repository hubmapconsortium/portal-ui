// Build-time constants injected via Vite's `define:` config (see vite.config.mts).
declare const CDN_URL: string;
declare const PACKAGE_VERSION: string;
// Stripped of any ^/~ range prefix.
declare const VITESSCE_VERSION: string;

// Flask data object embedded in react-content.html via {{ flask_data | tojson }}
// Default keys come from get_default_flask_data() in utils.py;
// route-specific keys are added by individual route handlers.
interface FlaskData {
  // Present from get_default_flask_data; optional in test/storybook contexts
  endpoints?: Record<string, string>;
  globalAlertMd?: string;
  // Protocols.io credentials (moved from endpoints to root by App)
  protocolsClientId?: string;
  protocolsClientToken?: string;
  // Route-specific keys
  entity?: Record<string, unknown>;
  title?: string;
  vitessce_conf?: object | object[];
  markdown?: string;
  errorCode?: number;
  list_uuid?: string;
  organs?: Record<string, unknown>;
  organs_count?: number;
  organ?: Record<string, unknown>;
  vignette_json?: Record<string, unknown>;
  geneSymbol?: string;
  cell_type?: string;
  // Cell type name resolved server-side from the warmed CLID->label map, so the detail page title
  // can render before the async aggregate fetch resolves.
  cell_type_name?: string;
  redirected_from?: string;
  redirected?: boolean;
  type?: string;
  tutorialName?: string;
  integrated?: boolean;
  [key: string]: unknown;
}

// Variables provided via Flask base.html template
declare const flaskData: FlaskData;
declare const groupsToken: string;
declare const isAuthenticated: boolean;
declare const userEmail: string;
declare const userFirstName: string;
declare const userLastName: string;
declare const userGlobusId: string;
declare const userGlobusAffiliation: string;
declare const workspacesToken: string;
declare const userGroups: string[];

declare module '*.svg' {
  const ReactComponent: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default ReactComponent;
}

declare module '*.css';

// React 19 moved the JSX namespace under React.JSX (the global JSX namespace
// is deprecated). Augmenting React.JSX.IntrinsicElements is the supported
// path now.
declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      'ccf-organ-info': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'ccf-body-ui-wc': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'ccf-body-ui': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

declare module 'openkeynav' {
  interface OpenKeyNavOptions {
    keys: {
      menu: string;
      modifierKey: 'metaKey' | 'ctrlKey' | 'altKey' | 'shiftKey';
    };
    debug: {
      keyboardAccessible: boolean;
    };
  }

  export default class OpenKeyNav {
    init(options: OpenKeyNavOptions): OpenKeyNav;
    enable(): void;
    disable(): void;
  }
}
