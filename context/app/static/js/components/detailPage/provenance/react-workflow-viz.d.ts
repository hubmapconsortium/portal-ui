/* eslint-disable max-classes-per-file */
/* eslint-disable react/prefer-stateless-function */

import { ProvNode } from './types';

declare module '@hms-dbmi-bgm/react-workflow-viz' {
  interface GraphProps {
    nodes: unknown[];
    edges: unknown[];
    renderNodeElement: (node: ProvNode) => JSX.Element;
    renderDetailPane: (node: ProvNode, props: GraphProps) => JSX.Element;
    onNodeClick?: (node: ProvNode) => void;
    isNodeDisabled?: (node: ProvNode) => boolean;
    innerMargin?: { top: number; right: number; bottom: number; left: number };
    pathArrows?: boolean;
    columnSpacing?: number;
    rowSpacing?: number;
    nodeTitle?: (node: ProvNode) => string;
  }

  interface GraphParserProps {
    parsingOptions: {
      parseBasicIO: boolean;
      showIndirectFiles: boolean;
      showParameters: boolean;
      showReferenceFiles: boolean;
    };
    parentItem: { name: string };
    steps: unknown[];
  }

  export default class Graph extends React.Component<GraphProps> {}
  export class GraphParser extends React.Component<GraphParserProps> {}
}
