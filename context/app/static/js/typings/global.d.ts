// Variables provided via webpack plugins
declare const CDN_URL: string;
declare const PACKAGE_VERSION: string;
// Variables provided via Flask
declare const flaskData: object;
declare const groupsToken: string;
declare const isAuthenticated: boolean;
declare const userEmail: string;
declare const workspacesToken: string;
declare const userGroups: string[];
declare const sentryEnv: string;

declare module '*.svg' {
  const ReactComponent: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default ReactComponent;
}

declare namespace JSX {
  interface IntrinsicElements {
    'ccf-organ-info': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'ccf-body-ui-wc': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'ccf-body-ui': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}

declare module 'package' {
  export const dependencies: Record<string, string>;
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
