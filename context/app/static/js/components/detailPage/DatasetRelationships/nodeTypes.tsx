import React, { PropsWithChildren } from 'react';
import { Node, NodeProps, Handle, Position, NodeTypes } from '@xyflow/react';
import Stack from '@mui/material/Stack';
import { DatasetIcon } from 'js/shared-styles/icons';
import Typography from '@mui/material/Typography';
import { AccountTreeRounded, ExtensionRounded, SvgIconComponent } from '@mui/icons-material';
import Skeleton from '@mui/material/Skeleton';
import { Box } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import { useHash } from 'js/hooks/useHash';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import StatusIcon from '../StatusIcon';
import { usePipelineInfo } from './hooks';
import { useProcessedDatasetDetails } from '../ProcessedData/ProcessedDataset/hooks';
import { makeNodeHref } from './utils';

interface CommonNodeInfo extends Record<string, unknown> {
  name: string;
}

interface PipelineNodeInfo extends CommonNodeInfo {
  childDatasets: string[];
  singleAssay?: boolean;
  description?: string;
}

interface DatasetNodeInfo extends CommonNodeInfo {
  datasetType?: string;
  uuid: string;
  status: string;
}

interface NodeTemplateProps extends PropsWithChildren, CommonNodeInfo {
  icon?: SvgIconComponent;
  status?: string;
  target?: boolean;
  source?: boolean;
  rounded?: boolean;
  bgColor?: string;
  isLoading?: boolean;
  href?: string;
  toastText?: string;
  tooltipText?: string;
}

export function useNodeColors() {
  const theme = useTheme();
  return {
    primaryDataset: theme.palette.accent.success90,
    processedDataset: theme.palette.accent.info90,
    pipeline: theme.palette.accent.primary90,
    componentDataset: theme.palette.accent.warning90,
  };
}

export const nodeIcons = {
  primaryDataset: DatasetIcon,
  processedDataset: AccountTreeRounded,
  pipeline: null,
  componentDataset: ExtensionRounded,
};

const nodeHeightRem = 4.125;
export const nodeHeight = nodeHeightRem * 16;

function NodeTemplate({
  icon: Icon,
  status,
  children,
  name,
  target,
  source,
  rounded,
  bgColor,
  isLoading,
  href,
  toastText,
  tooltipText,
}: NodeTemplateProps) {
  // Outer wrapper Box makes sure that nodes are always the same height
  const contents = (
    <Box height="4.125rem" display="flex" alignItems="center" sx={{ cursor: href ? 'pointer' : 'default' }}>
      <Stack
        direction="column"
        px={2}
        py={1}
        borderRadius={rounded ? '1rem' : 0}
        maxWidth="18rem"
        bgcolor={bgColor}
        boxShadow="0px 0px 2px 0px rgba(0, 0, 0, 0.14), 0px 2px 2px 0px rgba(0, 0, 0, 0.12), 0px 1px 3px 0px rgba(0, 0, 0, 0.20)"
      >
        <Stack direction="row" gap={1} my="auto" alignItems="center">
          {Icon && <Icon color="primary" fontSize="1.5rem" width="1.5rem" height="1.5rem" />}
          <Typography variant="subtitle2">{isLoading ? <Skeleton variant="text" width="10rem" /> : name}</Typography>
          {status && <StatusIcon status={status} tooltip />}
        </Stack>
        {children && <Typography variant="body2">{children}</Typography>}
        {target && <Handle style={{ opacity: 0 }} type="target" position={Position.Left} />}
        {source && <Handle style={{ opacity: 0 }} type="source" position={Position.Right} />}
      </Stack>
    </Box>
  );
  const [, setHash] = useHash();
  const { toastInfo } = useSnackbarActions();
  if (href) {
    const linkedContents = (
      <a
        onClick={(e) => {
          if (isLoading) return;
          if (href.startsWith('#')) {
            e.preventDefault();
            const sanitizedHref = `#${CSS.escape(href.split('#')[1])}`;
            document.querySelector(sanitizedHref)?.scrollIntoView({ behavior: 'smooth' });
            setHash(href);
            if (toastText) {
              toastInfo(toastText);
            }
          }
        }}
        href={href}
      >
        {contents}
      </a>
    );
    if (tooltipText) {
      return (
        <SecondaryBackgroundTooltip title={tooltipText} placement="top">
          {linkedContents}
        </SecondaryBackgroundTooltip>
      );
    }
    return linkedContents;
  }
  return contents;
}

type PrimaryDatasetNodeProps = Node<DatasetNodeInfo, 'primaryDataset'>;

function PrimaryDatasetNode({ data }: NodeProps<PrimaryDatasetNodeProps>) {
  const colors = useNodeColors();
  return (
    <NodeTemplate source rounded icon={nodeIcons.primaryDataset} {...data} bgColor={colors.primaryDataset}>
      {data.datasetType}
    </NodeTemplate>
  );
}

type PipelineNodeProps = Node<PipelineNodeInfo, 'pipeline'>;

function PipelineNode({
  data: { childDatasets, singleAssay, name, description: _description },
}: NodeProps<PipelineNodeProps>) {
  const { pipelineInfo = name, isLoading } = usePipelineInfo(childDatasets);
  const colors = useNodeColors();
  const [selectedName, description] = singleAssay
    ? [pipelineInfo, _description]
    : ['Multi Assay Pipeline', 'Create component datasets'];
  return (
    <NodeTemplate source target name={selectedName} isLoading={isLoading} bgColor={colors.pipeline}>
      {description}
    </NodeTemplate>
  );
}

type ProcessedDatasetNodeProps = Node<DatasetNodeInfo, 'processedDataset'>;

function ProcessedDatasetNode({ data }: NodeProps<ProcessedDatasetNodeProps>) {
  const { datasetDetails, isLoading } = useProcessedDatasetDetails(data.uuid);
  const colors = useNodeColors();
  return (
    <NodeTemplate
      rounded
      target
      href={makeNodeHref(datasetDetails)}
      icon={nodeIcons.processedDataset}
      bgColor={colors.processedDataset}
      isLoading={isLoading}
      toastText={`Scrolled to ${datasetDetails?.pipeline}`}
      tooltipText={`Scroll to ${datasetDetails?.pipeline}`}
      {...data}
    >
      {data.datasetType}
    </NodeTemplate>
  );
}

type ComponentDatasetNodeProps = Node<DatasetNodeInfo, 'componentDataset'>;

function ComponentDatasetNode({ data }: NodeProps<ComponentDatasetNodeProps>) {
  const colors = useNodeColors();
  return (
    <NodeTemplate
      rounded
      target
      icon={nodeIcons.componentDataset}
      bgColor={colors.componentDataset}
      isLoading={false}
      {...data}
    >
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
