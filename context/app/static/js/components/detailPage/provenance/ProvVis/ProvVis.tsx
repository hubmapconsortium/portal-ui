import React, { useMemo, useEffect, useRef } from 'react';
import { ReactFlow, Controls, Node, ReactFlowProps, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEventCallback } from '@mui/material/utils';

import useProvenanceStore from 'js/stores/useProvenanceStore';
import { ProvData as ProvDataType } from '../types';
import { nodeTypes } from '../nodeTypes';
import { convertProvDataToNodesAndEdges } from '../utils/provToNodesAndEdges';
import { applyLayout } from '../utils/applyLayout';

interface ProvVisProps {
  provData: ProvDataType;
  getNameForActivity: (id: string, prov?: ProvDataType) => string;
  getNameForEntity: (id: string, prov?: ProvDataType) => string;
  entity_type: string;
}

const reactFlowConfig: Partial<ReactFlowProps> = {
  proOptions: { hideAttribution: true },
  nodesDraggable: false,
  nodesConnectable: false,
  edgesFocusable: false,
  nodeTypes,
  minZoom: 0.1,
  maxZoom: 2,
  fitView: true,
} as const;

function ProvVisInner({ provData, getNameForActivity, getNameForEntity, entity_type }: ProvVisProps) {
  const uuid = useProvenanceStore((state) => state.uuid);
  const selectedNodeId = useProvenanceStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useProvenanceStore((state) => state.setSelectedNodeId);
  const hasRendered = useProvenanceStore((state) => state.hasRendered);
  const setHasRendered = useProvenanceStore((state) => state.setHasRendered);
  const { fitView } = useReactFlow();
  const hasFocusedRef = useRef(false);

  // Convert PROV data to nodes and edges, then apply layout
  const { nodes: layoutNodes, edges: layoutEdges } = useMemo(() => {
    const { nodes: rawNodes, edges: rawEdges } = convertProvDataToNodesAndEdges(provData, {
      currentUuid: uuid,
      getNameForActivity,
      getNameForEntity,
      entityType: entity_type,
    });
    // Mark selected node
    const nodesWithSelection = rawNodes.map((node) => ({
      ...node,
      data: { ...node.data, isSelected: node.id === selectedNodeId },
    }));
    return applyLayout(nodesWithSelection, rawEdges);
  }, [provData, getNameForActivity, getNameForEntity, entity_type, uuid, selectedNodeId]);

  // Focus on the current entity node on initial load
  useEffect(() => {
    if (layoutNodes.length > 0 && !hasFocusedRef.current) {
      const currentEntityNode = layoutNodes.find((node) => node.data?.isCurrentEntity);
      if (currentEntityNode) {
        // Wait for ReactFlow to be ready, then focus on the current entity
        setTimeout(() => {
          void fitView({
            nodes: [currentEntityNode],
            duration: 300,
            padding: 0.75,
          });
          hasFocusedRef.current = true;
          if (!hasRendered) {
            setHasRendered();
          }
        }, 100);
      }
    }
  }, [layoutNodes, fitView, hasRendered, setHasRendered]);

  const handleNodeClick = useEventCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  });

  if (layoutNodes.length === 0) {
    return null;
  }

  return (
    <ReactFlow {...reactFlowConfig} nodes={layoutNodes} edges={layoutEdges} onNodeClick={handleNodeClick}>
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}

export default function ProvVis(props: ProvVisProps) {
  return (
    <ReactFlowProvider>
      <ProvVisInner {...props} />
    </ReactFlowProvider>
  );
}
