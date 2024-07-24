import React, { PropsWithChildren } from 'react';
import { Node, NodeProps, Handle, Position, NodeTypes } from '@xyflow/react';
import Stack from '@mui/material/Stack';
import { DatasetIcon } from 'js/shared-styles/icons';
import Typography from '@mui/material/Typography';
import { AccountTreeRounded, ExtensionRounded, SvgIconComponent } from '@mui/icons-material';
import StatusIcon from '../StatusIcon';

interface CommonNodeInfo extends Record<string, unknown> {
  name: string;
}

interface PipelineNodeInfo extends CommonNodeInfo {
  description?: string;
}

interface DatasetNodeInfo extends CommonNodeInfo {
  datasetType?: string;
  status: string;
}

interface NodeTemplateProps extends PropsWithChildren, CommonNodeInfo {
  icon?: SvgIconComponent;
  status?: string;
  target?: boolean;
  source?: boolean;
  rounded?: boolean;
  bgColor?: string;
}

export const nodeColors = {
  primaryDataset: '#F0F3EB',
  processedDataset: '#EAF0F8',
  pipeline: '#EFEFEF',
  componentDataset: '#FBEEEB',
};

export const nodeIcons = {
  primaryDataset: DatasetIcon,
  processedDataset: AccountTreeRounded,
  pipeline: null,
  componentDataset: ExtensionRounded,
};

function NodeTemplate({ icon: Icon, status, children, name, target, source, rounded, bgColor }: NodeTemplateProps) {
  return (
    <Stack
      direction="column"
      px={2}
      py={1}
      borderRadius={rounded ? '1rem' : 0}
      minWidth="100%"
      maxWidth="17.75rem"
      bgcolor={bgColor}
      boxShadow="0px 0px 2px 0px rgba(0, 0, 0, 0.14), 0px 2px 2px 0px rgba(0, 0, 0, 0.12), 0px 1px 3px 0px rgba(0, 0, 0, 0.20)"
    >
      <Stack direction="row" gap={1} alignItems="center">
        {Icon && <Icon color="primary" fontSize="1.5rem" width="1.5rem" height="1.5rem" />}
        <Typography variant="subtitle2">{name}</Typography>
        {status && <StatusIcon status={status} />}
      </Stack>
      {children && <Typography variant="body2">{children}</Typography>}
      {target && <Handle style={{ opacity: 0 }} type="target" position={Position.Left} />}
      {source && <Handle style={{ opacity: 0 }} type="source" position={Position.Right} />}
    </Stack>
  );
}

type PrimaryDatasetNodeProps = Node<DatasetNodeInfo, 'primaryDataset'>;

function PrimaryDatasetNode({ data }: NodeProps<PrimaryDatasetNodeProps>) {
  return (
    <NodeTemplate source rounded icon={nodeIcons.primaryDataset} {...data} bgColor={nodeColors.primaryDataset}>
      {data.datasetType}
    </NodeTemplate>
  );
}

type PipelineNodeProps = Node<PipelineNodeInfo, 'pipeline'>;

function PipelineNode({ data }: NodeProps<PipelineNodeProps>) {
  return (
    <NodeTemplate source target {...data} bgColor={nodeColors.pipeline}>
      {data.description}
    </NodeTemplate>
  );
}

type ProcessedDatasetNodeProps = Node<DatasetNodeInfo, 'processedDataset'>;

function ProcessedDatasetNode({ data }: NodeProps<ProcessedDatasetNodeProps>) {
  return (
    <NodeTemplate rounded target icon={nodeIcons.processedDataset} bgColor={nodeColors.processedDataset} {...data}>
      {data.datasetType}
    </NodeTemplate>
  );
}

type ComponentDatasetNodeProps = Node<DatasetNodeInfo, 'componentDataset'>;

function ComponentDatasetNode({ data }: NodeProps<ComponentDatasetNodeProps>) {
  return (
    <NodeTemplate rounded target icon={nodeIcons.componentDataset} bgColor={nodeColors.componentDataset} {...data}>
      {data.datasetType}
    </NodeTemplate>
  );
}

export const nodeTypes: NodeTypes = {
  primaryDataset: PrimaryDatasetNode,
  pipeline: PipelineNode,
  processedDataset: ProcessedDatasetNode,
  componentDataset: ComponentDatasetNode,
};
