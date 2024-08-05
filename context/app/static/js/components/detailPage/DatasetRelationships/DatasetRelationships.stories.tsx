import React, { type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { type Edge } from '@xyflow/react';
import { http, HttpResponse } from 'msw';

import { DatasetRelationshipsVisualization } from './DatasetRelationships';
import { NodeWithoutPosition } from './types';
import { nodes, edges } from './prov.fixtures';

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
      singleAssay: true,
    },
  },
  {
    id: 'pipeline-segmentation-mask',
    type: 'pipeline',
    data: {
      name: 'Segmentation Mask Action',
      description: 'External',
      singleAssay: true,
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
  },
  {
    id: 'pipeline-cytokit-HBM123.ABCD.456',
    source: 'pipeline-cytokit',
    target: 'HBM123.ABCD.456',
  },
  {
    id: 'HBM123.ABCD.123-pipeline-segmentation-mask',
    source: 'HBM123.ABCD.123',
    target: 'pipeline-segmentation-mask',
  },
  {
    id: 'pipeline-segmentation-mask-HBM123.ABCD.789',
    source: 'pipeline-segmentation-mask',
    target: 'HBM123.ABCD.789',
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
    id: 'pipeline-split',
    type: 'pipeline',
    data: {
      name: 'Multi Assay Split',
      childDatasets: ['HBM123.ABCD.555', 'HBM123.ABCD.666'],
    },
  },
  {
    id: 'pipeline-salmon-scanpy',
    type: 'pipeline',
    data: {
      name: 'Salmon + Scanpy',
      childDatasets: ['HBM123.ABCD.999'],
      singleAssay: true,
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
    id: 'HBM123.ABCD.123-pipeline-split',
    source: 'HBM123.ABCD.123',
    target: 'pipeline-split',
  },
  {
    id: 'HBM123.ABCD.123-pipeline-salmon-scanpy',
    source: 'HBM123.ABCD.123',
    target: 'pipeline-salmon-scanpy',
  },
  {
    id: 'pipeline-split-capture-bead-HBM123.ABCD.555',
    source: 'pipeline-split',
    target: 'HBM123.ABCD.555',
  },
  {
    id: 'pipeline-split-microscopy-HBM123.ABCD.666',
    source: 'pipeline-split',
    target: 'HBM123.ABCD.666',
  },
  {
    id: 'pipeline-salmon-scanpy-HBM123.ABCD.999',
    source: 'pipeline-salmon-scanpy',
    target: 'HBM123.ABCD.999',
  },
];

function TemplateComponent(args: ComponentProps<typeof DatasetRelationshipsVisualization>) {
  return (
    <div style={{ height: 600 }}>
      <DatasetRelationshipsVisualization {...args} />
    </div>
  );
}

const salmonScanpySoftAssayResponse = () =>
  HttpResponse.json({
    assaytype: 'salmon-scanpy',
    'contains-pii': false,
    description: 'Salmon + Scanpy',
    'pipeline-shorthand': 'Salmon + Scanpy',
    primary: false,
    'vitessce-hints': [],
  });

const codexSPRMresponse = () =>
  HttpResponse.json({
    assaytype: 'codex_cytokit',
    'contains-pii': false,
    description: 'CODEX [Cytokit + SPRM]',
    'pipeline-shorthand': 'Cytokit + SPRM',
    primary: false,
    'vitessce-hints': ['sprm', 'anndata', 'is_image', 'is_tiled'],
  });

const meta: Meta = {
  title: 'DatasetRelationships/DatasetRelationships',
  component: TemplateComponent,
  args: {
    nodes: singleAssayNodes,
    edges: singleAssayEdges,
  },
  parameters: {
    msw: {
      handlers: [http.get('/soft-assay-endpoint/assaytype/HBM123.ABCD.456', codexSPRMresponse)],
    },
  },
};

export const SingleAssay: StoryObj<typeof TemplateComponent> = {
  args: {
    nodes: singleAssayNodes,
    edges: singleAssayEdges,
  },
  parameters: {
    msw: {
      handlers: [http.get('/soft-assay-endpoint/assaytype/HBM123.ABCD.456', codexSPRMresponse)],
    },
  },
};

export const MultiAssay: StoryObj<typeof TemplateComponent> = {
  args: {
    nodes: multiAssayNodes,
    edges: multiAssayEdges,
  },
  parameters: {
    msw: {
      handlers: [http.get('/soft-assay-endpoint/assaytype/HBM123.ABCD.999', salmonScanpySoftAssayResponse)],
    },
  },
};

export const RealProv: StoryObj<typeof TemplateComponent> = {
  args: {
    nodes,
    edges,
  },
  parameters: {
    msw: {
      handlers: [
        http.get<{ id: string }>(`/soft-assay-endpoint/assaytype/d8f851efb54f84d7ee0952e10d4c449e`, codexSPRMresponse),
        http.get<{ id: string }>(`/soft-assay-endpoint/assaytype/ff77fcae7f6d9b5b7b8741c282677eef`, codexSPRMresponse),
      ],
    },
  },
};

export default meta;
