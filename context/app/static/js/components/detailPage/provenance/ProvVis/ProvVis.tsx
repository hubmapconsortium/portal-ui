import React, { useMemo, useEffect, useRef } from 'react';
import { ReactFlow, Controls, Node, ReactFlowProps, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEventCallback } from '@mui/material/utils';

import { useProvenanceStore } from '../ProvContext';
import { nodeTypes } from '../nodeTypes';

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

function ProvVisInner() {
  const selectedNodeId = useProvenanceStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useProvenanceStore((state) => state.setSelectedNodeId);
  const hasRendered = useProvenanceStore((state) => state.hasRendered);
  const setHasRendered = useProvenanceStore((state) => state.setHasRendered);
  const storedNodes = useProvenanceStore((state) => state.nodes);
  const storedEdges = useProvenanceStore((state) => state.edges);
  const { fitView } = useReactFlow();
  const hasFocusedRef = useRef(false);

  // Apply selection state to nodes
  const nodesWithSelection = useMemo(
    () =>
      storedNodes.map((node) => ({
        ...node,
        data: { ...node.data, isSelected: node.id === selectedNodeId } as typeof node.data & {
          isSelected: boolean;
        },
      })),
    [storedNodes, selectedNodeId],
  );

  // Focus on the current entity node on initial load
  useEffect(() => {
    if (nodesWithSelection.length > 0 && !hasFocusedRef.current) {
      const currentEntityNode = nodesWithSelection.find((node) => node.data?.isCurrentEntity);
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
  }, [nodesWithSelection, fitView, hasRendered, setHasRendered]);

  const handleNodeClick = useEventCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  });

  if (nodesWithSelection.length === 0) {
    return null;
  }

  return (
    <ReactFlow {...reactFlowConfig} nodes={nodesWithSelection} edges={storedEdges} onNodeClick={handleNodeClick}>
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}

export default function ProvVis() {
  return (
    <ReactFlowProvider>
      <ProvVisInner />
    </ReactFlowProvider>
  );
}
