import type { Node, Edge } from '@xyflow/react';
import { createStoreContext, createStoreImmer } from 'js/helpers/zustand';
import { applyLayout } from './utils/applyLayout';
import { NodeWithoutPosition } from './utils/provToNodesAndEdges';

interface ProvenanceStoreState {
  uuid: string;
  hasRendered: boolean;
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  uuids: string[];
}

interface ProvenanceStoreActions {
  setHasRendered: () => void;
  setUUID: (uuid: string) => void;
  setNodesAndEdges: (nodes: Node[], edges: Edge[]) => void;
  addDescendantNodesAndEdges: (newNodes: Node[], newEdges: Edge[]) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  addUuids: (newUuids: string[]) => void;
}

export type ProvenanceStoreType = ProvenanceStoreState & ProvenanceStoreActions;

interface ProvenanceStoreInput {
  initialUuid: string;
  initialUuids: string[];
}

export const createProvenanceStore = ({ initialUuid, initialUuids }: ProvenanceStoreInput) =>
  createStoreImmer<ProvenanceStoreType>((set, get) => ({
    uuid: initialUuid,
    hasRendered: false,
    nodes: [],
    edges: [],
    selectedNodeId: null,
    uuids: initialUuids,
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
        // Get existing node IDs for deduplication
        const existingNodeIds = new Set(state.nodes.map((n) => n.id));

        // Add only new nodes that don't already exist
        const nodesToAdd = newNodes.filter((n) => !existingNodeIds.has(n.id));

        // Collect all edges to add, avoiding duplicates
        const edgesToAddMap = new Map<string, Edge>();

        // First, add existing edges to the map
        state.edges.forEach((edge) => {
          edgesToAddMap.set(edge.id, edge);
        });

        // Then, add new edges (this will naturally deduplicate by ID)
        newEdges.forEach((edge) => {
          edgesToAddMap.set(edge.id, edge);
        });

        // Combine all nodes and edges
        const allNodes = [...state.nodes, ...nodesToAdd];
        const allEdges = Array.from(edgesToAddMap.values());

        // Re-apply layout to all nodes to prevent overlaps
        // Strip position from nodes to force recalculation
        const nodesWithoutPosition = allNodes.map(
          (n) =>
            ({
              id: n.id,
              type: n.type,
              data: n.data,
            }) as NodeWithoutPosition,
        );

        const { nodes: layoutNodes, edges: layoutEdges } = applyLayout(nodesWithoutPosition, allEdges);

        state.nodes = layoutNodes;
        state.edges = layoutEdges;
      });
    },
    addUuids: (newUuids) => {
      set((state) => {
        const uniqueUuids = [...new Set([...state.uuids, ...newUuids])];
        state.uuids = uniqueUuids;
      });
    },
  }));

const [ProvenanceStoreProvider, useProvenanceStore] = createStoreContext<ProvenanceStoreType, ProvenanceStoreInput>(
  createProvenanceStore,
  'Provenance Store',
);

export { ProvenanceStoreProvider, useProvenanceStore };
