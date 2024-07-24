import React, { type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { type Edge, MarkerType } from '@xyflow/react';

import { DatasetRelationships } from './DatasetRelationships';
import { NodeWithoutPosition } from './types';

const singleAssayNodes: NodeWithoutPosition[] = [
  {
    id: 'HBM123.ABCD.123',
    type: 'primaryDataset',
    data: {
      status: 'published',
      name: 'HBM123.ABCD.456',
      datasetType: 'CODEX',
    },
  },
  {
    id: 'pipeline-cytokit',
    type: 'pipeline',
    data: {
      name: 'Cytokit + SPRM',
    },
  },
  {
    id: 'pipeline-segmentation-mask',
    type: 'pipeline',
    data: {
      name: 'Segmentation Mask Action',
      description: 'External',
    },
  },
  {
    id: 'HBM123.ABCD.456',
    type: 'processedDataset',
    data: {
      name: 'HBM123.ABCD.456',
      status: 'published',
    },
  },
  {
    id: 'HBM123.ABCD.789',
    type: 'processedDataset',
    data: {
      name: 'HBM123.ABCD.789',
      status: 'error',
    },
  },
];

const singleAssayEdges: Edge[] = [
  {
    id: 'HBM123.ABCD.123-pipeline-cytokit',
    source: 'HBM123.ABCD.123',
    target: 'pipeline-cytokit',
    type: 'straight',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'pipeline-cytokit-HBM123.ABCD.456',
    source: 'pipeline-cytokit',
    target: 'HBM123.ABCD.456',
    type: 'straight',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'HBM123.ABCD.123-pipeline-segmentation-mask',
    source: 'HBM123.ABCD.123',
    target: 'pipeline-segmentation-mask',
    type: 'straight',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'pipeline-segmentation-mask-HBM123.ABCD.789',
    source: 'pipeline-segmentation-mask',
    target: 'HBM123.ABCD.789',
    type: 'straight',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
];

const multiAssayNodes: NodeWithoutPosition[] = [
  {
    id: 'HBM123.ABCD.123',
    type: 'primaryDataset',
    data: {
      status: 'published',
      name: 'HBM123.ABCD.456',
      datasetType: 'CODEX',
    },
  },
  {
    id: 'pipeline-split-capture-bead',
    type: 'pipeline',
    data: {
      name: 'Multi Assay Split',
      description: 'Create component dataset',
    },
  },
  {
    id: 'pipeline-split-microscopy',
    type: 'pipeline',
    data: {
      name: 'Multi Assay Split',
      description: 'Create component dataset',
    },
  },
  {
    id: 'pipeline-salmon-scanpy',
    type: 'pipeline',
    data: {
      name: 'Salmon + Scanpy',
    },
  },
  {
    id: 'HBM123.ABCD.555',
    type: 'componentDataset',
    data: {
      name: 'HBM123.ABCD.555',
      status: 'published',
      datasetType: 'Capture bead RNAseq (10x Genomics v3)',
    },
  },
  {
    id: 'HBM123.ABCD.666',
    type: 'componentDataset',
    data: {
      name: 'HBM123.ABCD.666',
      status: 'published',
      datasetType: 'H&E Stained Microscopy',
    },
  },
  {
    id: 'HBM123.ABCD.999',
    type: 'processedDataset',
    data: {
      name: 'HBM123.ABCD.999',
      status: 'published',
      datasetType: 'Salmon + Scanpy',
    },
  },
];

const multiAssayEdges: Edge[] = [
  {
    id: 'HBM123.ABCD.123-pipeline-split-capture-bead',
    source: 'HBM123.ABCD.123',
    target: 'pipeline-split-capture-bead',
  },
  {
    id: 'HBM123.ABCD.123-pipeline-split-microscopy',
    source: 'HBM123.ABCD.123',
    target: 'pipeline-split-microscopy',
  },
  {
    id: 'HBM123.ABCD.123-pipeline-salmon-scanpy',
    source: 'HBM123.ABCD.123',
    target: 'pipeline-salmon-scanpy',
  },
  {
    id: 'pipeline-split-capture-bead-HBM123.ABCD.555',
    source: 'pipeline-split-capture-bead',
    target: 'HBM123.ABCD.555',
  },
  {
    id: 'pipeline-split-microscopy-HBM123.ABCD.666',
    source: 'pipeline-split-microscopy',
    target: 'HBM123.ABCD.666',
  },
  {
    id: 'pipeline-salmon-scanpy-HBM123.ABCD.999',
    source: 'pipeline-salmon-scanpy',
    target: 'HBM123.ABCD.999',
  },
];

function TemplateComponent(args: ComponentProps<typeof DatasetRelationships>) {
  return (
    <div style={{ height: 600 }}>
      <DatasetRelationships {...args} />
    </div>
  );
}

const meta: Meta = {
  title: 'DatasetRelationships/DatasetRelationships',
  component: TemplateComponent,
  args: {
    nodes: singleAssayNodes,
    edges: singleAssayEdges,
  },
};

export const SingleAssay: StoryObj<typeof TemplateComponent> = {
  args: {
    nodes: singleAssayNodes,
    edges: singleAssayEdges,
  },
};

export const MultiAssay: StoryObj<typeof TemplateComponent> = {
  args: {
    nodes: multiAssayNodes,
    edges: multiAssayEdges,
  },
};

export default meta;
