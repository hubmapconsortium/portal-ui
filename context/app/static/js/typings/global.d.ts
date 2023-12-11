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

declare module '*.yaml' {
  const data: unknown;
  export default data;
}

declare module 'metadata-field-entities' {
  const data: Record<string, string>;
  export default data;
}

declare module 'metadata-field-descriptions' {
  const data: Record<string, string>;
  export default data;
}

declare module 'metadata-field-types' {
  const data: Record<string, string>;
  export default data;
}

declare module 'metadata-field-assays' {
  const data: Record<string, string[]>;
  export default data;
}

declare module '*.svg' {
  const ReactComponent: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export { ReactComponent };
}

declare namespace JSX {
  interface IntrinsicElements {
    'ccf-organ-info': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'ccf-body-ui-wc': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'ccf-body-ui': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}
