import React, { useMemo } from 'react';
import { ReactFlow, Controls, Node, ReactFlowProps } from '@xyflow/react';
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
  fitView: true,
  minZoom: 0.1,
  maxZoom: 2,
} as const;

export default function ProvVis({ provData, getNameForActivity, getNameForEntity, entity_type }: ProvVisProps) {
  const uuid = useProvenanceStore((state) => state.uuid);
  const setSelectedNodeId = useProvenanceStore((state) => state.setSelectedNodeId);

  // Convert PROV data to nodes and edges, then apply layout
  const { nodes: layoutNodes, edges: layoutEdges } = useMemo(() => {
    const { nodes: rawNodes, edges: rawEdges } = convertProvDataToNodesAndEdges(provData, {
      currentUuid: uuid,
      getNameForActivity,
      getNameForEntity,
      entityType: entity_type,
    });
    return applyLayout(rawNodes, rawEdges);
  }, [provData, getNameForActivity, getNameForEntity, entity_type, uuid]);

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
