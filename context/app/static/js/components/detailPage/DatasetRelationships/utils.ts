import { Node, Edge } from '@xyflow/react';
import Dagre from '@dagrejs/dagre';
import { NodeWithoutPosition } from './types';

export function applyLayout(nodes: NodeWithoutPosition[], edges: Edge[]): { nodes: Node[]; edges: Edge[] } {
  if (nodes.length === 0 || !document) {
    return { nodes: nodes.map((n) => ({ ...n, position: { x: 0, y: 0 } })), edges };
  }
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'LR' });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 256,
      height: node.measured?.height ?? 50,
    }),
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.measured?.width ?? 256) / 2;
      const y = position.y - (node.measured?.height ?? 50) / 2;

      return { ...node, position: { x, y } } as Node;
    }),
    edges,
  };
}
