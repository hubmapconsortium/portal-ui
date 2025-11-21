import type { Node, Edge } from '@xyflow/react';
import { createImmer } from 'js/helpers/zustand';

interface ProvenanceStoreState {
  uuid: string;
  hasRendered: boolean;
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
}

interface ProvenanceStoreActions {
  setHasRendered: () => void;
  setUUID: (uuid: string) => void;
  setNodesAndEdges: (nodes: Node[], edges: Edge[]) => void;
  addDescendantNodesAndEdges: (newNodes: Node[], newEdges: Edge[]) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
}

export type ProvenanceStore = ProvenanceStoreState & ProvenanceStoreActions;

const useProvenanceStore = createImmer<ProvenanceStore>((set, get) => ({
  uuid: '',
  hasRendered: false,
  nodes: [],
  edges: [],
  selectedNodeId: null,
  setHasRendered: () => {
    if (!get().hasRendered) {
      set((state) => {
        state.hasRendered = true;
      });
    }
  },
  setUUID: (uuid) => {
    set((state) => {
      state.uuid = uuid;
    });
  },
  setNodesAndEdges: (nodes, edges) => {
    set((state) => {
      state.nodes = nodes;
      state.edges = edges;
    });
  },
  setSelectedNodeId: (nodeId) => {
    set((state) => {
      state.selectedNodeId = nodeId;
    });
  },
  addDescendantNodesAndEdges: (newNodes, newEdges) => {
    set((state) => {
      // Get existing node and edge IDs for deduplication
      const existingNodeIds = new Set(state.nodes.map((n) => n.id));
      const existingEdgeIds = new Set(state.edges.map((e) => e.id));

      // Add only new nodes that don't already exist
      const nodesToAdd = newNodes.filter((n) => !existingNodeIds.has(n.id));
      state.nodes = [...state.nodes, ...nodesToAdd];

      // Add only new edges that don't already exist
      const edgesToAdd = newEdges.filter((e) => !existingEdgeIds.has(e.id));

      // Also create connecting edges between existing and new nodes
      // Find new nodes that have edges to existing nodes
      newEdges.forEach((edge) => {
        const sourceExists = existingNodeIds.has(edge.source);
        const targetExists = existingNodeIds.has(edge.target);
        const edgeExists = existingEdgeIds.has(edge.id);

        // Add edge if it connects new and existing nodes and doesn't already exist
        if (!edgeExists && (sourceExists || targetExists)) {
          edgesToAdd.push(edge);
        }
      });

      state.edges = [...state.edges, ...edgesToAdd];
    });
  },
}));

export default useProvenanceStore;
