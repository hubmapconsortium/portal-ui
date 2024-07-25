import React from 'react';

import { ReactFlow, Controls, Edge, ReactFlowProps } from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { InfoIcon } from 'js/shared-styles/icons';
import Box from '@mui/material/Box';
import { nodeTypes } from './nodeTypes';
import { edgeTypes } from './edgeTypes';
import { applyLayout } from './utils';
import { NodeLegend, StatusLegend } from './Legend';
import { useDatasetStatuses, useDatasetTypes } from './hooks';
import { NodeWithoutPosition } from './types';

interface DatasetRelationshipsProps {
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
  panOnDrag: false,
  zoomOnScroll: false,
  nodeTypes,
  edgeTypes,
} as const;

export function DatasetRelationships({ nodes: initialNodes, edges: initialEdges }: DatasetRelationshipsProps) {
  const { nodes, edges } = applyLayout(initialNodes, initialEdges);
  const statuses = useDatasetStatuses(nodes.map(({ data }) => data));
  const types = useDatasetTypes(nodes);
  return (
    <>
      <DatasetRelationshipsHeader />
      <Box sx={{ aspectRatio: '16 / 9' }}>
        <ReactFlow {...reactFlowConfig} nodes={nodes} edges={edges}>
          <Controls showInteractive={false} />
        </ReactFlow>
      </Box>
      <Stack direction="row" gap={1}>
        <NodeLegend nodeTypes={types} />
        <StatusLegend statuses={statuses} />
      </Stack>
    </>
  );
}
