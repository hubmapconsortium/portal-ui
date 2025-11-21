import { Node, Edge } from '@xyflow/react';
import Dagre from '@dagrejs/dagre';
import { NodeWithoutPosition } from './provToNodesAndEdges';

// Height for provenance nodes (slightly taller than dataset relationship nodes)
export const nodeHeight = 70;

/**
 * Applies Dagre layout algorithm to position nodes in a left-to-right flow
 * Adapted from DatasetRelationships implementation
 */
export function applyLayout(nodes: NodeWithoutPosition[], edges: Edge[]): { nodes: Node[]; edges: Edge[] } {
  if (nodes.length === 0 || !document) {
    return { nodes: nodes.map((n) => ({ ...n, position: { x: 0, y: 0 } })), edges };
  }

  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: 'LR', // Left to right
    ranksep: 100, // Horizontal spacing between ranks
    nodesep: 50, // Vertical spacing between nodes
    marginx: 10,
    marginy: 10,
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: 250, // Default width for provenance nodes
      height: nodeHeight,
    }),
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      return { ...node, position } as Node;
    }),
    edges,
  };
}
