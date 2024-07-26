import React from 'react';

import { ReactFlow, Controls, Edge, Node, ReactFlowProps } from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { InfoIcon } from 'js/shared-styles/icons';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { nodeTypes } from './nodeTypes';
import { applyLayout } from './utils';
import { NodeLegend, StatusLegend } from './Legend';
import { useDatasetRelationships, useDatasetRelationshipsTracking, useDatasetStatuses, useDatasetTypes } from './hooks';
import { NodeWithoutPosition } from './types';

interface DatasetRelationshipsVisualizationProps {
  nodes: NodeWithoutPosition[];
  edges: Edge[];
}

function DatasetRelationshipsHeader() {
  return (
    <Stack direction="column" gap={1}>
      <Typography variant="subtitle1">Dataset Relationship Diagram</Typography>
      <Stack direction="row" gap={1} alignItems="center">
        <InfoIcon color="primary" />
        This diagram illustrates any additional processing applied to this dataset.
      </Stack>
    </Stack>
  );
}

const reactFlowConfig: Partial<ReactFlowProps> = {
  fitView: true,
  proOptions: { hideAttribution: true },
  nodesDraggable: false,
  nodesConnectable: false,
  edgesFocusable: false,
  nodeTypes,
  onError: console.error,
} as const;

function ReactFlowBody({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) {
  const { trackFitView, trackZoomIn, trackZoomOut } = useDatasetRelationshipsTracking();

  // If nodes haven't loaded yet, show a skeleton that fills the same container
  if (!nodes.length) {
    return <Skeleton height="100%" width="100%" />;
  }
  return (
    <ReactFlow {...reactFlowConfig} nodes={nodes} edges={edges}>
      <Controls showInteractive={false} onFitView={trackFitView} onZoomIn={trackZoomIn} onZoomOut={trackZoomOut} />
    </ReactFlow>
  );
}

export function DatasetRelationshipsVisualization({
  nodes: initialNodes,
  edges: initialEdges,
}: DatasetRelationshipsVisualizationProps) {
  const { nodes, edges } = applyLayout(initialNodes, initialEdges);
  const statuses = useDatasetStatuses(initialNodes.map(({ data }) => data));
  const types = useDatasetTypes(initialNodes);

  return (
    <>
      <DatasetRelationshipsHeader />
      <Box sx={{ aspectRatio: '16 / 9' }}>
        <ReactFlowBody nodes={nodes} edges={edges} />
      </Box>
      <Stack direction="row" gap={1}>
        <NodeLegend nodeTypes={types} />
        <StatusLegend statuses={statuses} />
      </Stack>
    </>
  );
}

interface DatasetRelationshipsSectionProps {
  uuid: string;
  processing: string;
}

export function DatasetRelationships({ uuid, processing }: DatasetRelationshipsSectionProps) {
  const shouldDisplay = processing === 'raw';
  const datasetRelationships = useDatasetRelationships(uuid, shouldDisplay);
  if (!shouldDisplay) {
    return null;
  }
  return <DatasetRelationshipsVisualization {...datasetRelationships} />;
}
