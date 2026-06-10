import React, { PropsWithChildren } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import InfoTooltipIcon from 'js/shared-styles/icons/TooltipIcon';
import { nodeIcons, useNodeColors } from './nodeTypes';
import StatusIcon from '../StatusIcon';

interface NodeLegendItemProps {
  name: string;
  nodeKey: keyof typeof nodeIcons;
  bgColor: string;
  iconColor?: 'primary' | 'white';
}

function NodeLegendItem({ name, nodeKey, bgColor, iconColor = 'primary' }: NodeLegendItemProps) {
  const Icon = nodeIcons[nodeKey];
  const borderRadius = nodeKey === 'pipeline' ? 0 : 4;
  return (
    <Stack direction="row" gap={0.5} alignItems="center">
      <Box
        width={32}
        height={16}
        borderRadius={borderRadius}
        bgcolor={bgColor}
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
      >
        {Icon && <Icon color={iconColor} fontSize="0.75rem" />}
      </Box>
      <Typography variant="caption">{name}</Typography>
    </Stack>
  );
}

const nodeTypesList = [
  ['Raw Dataset', 'primaryDataset'],
  ['Processed Dataset', 'processedDataset'],
  ['Action/Pipeline', 'pipeline'],
  ['Component', 'componentDataset'],
] as const;

// Retracted variants mirror the Raw/Processed delineation above, reusing those node icons on the
// retracted background color. Each entry is shown only when a node of that type is retracted.
const retractedNodeTypesList = [
  ['Retracted Primary', 'primaryDataset'],
  ['Retracted Processed Dataset', 'processedDataset'],
] as const;

interface LegendProps {
  title: string;
  tooltip?: string;
}

function Legend({ children, title, tooltip }: PropsWithChildren<LegendProps>) {
  return (
    <Stack flexBasis="50%" gap={1} px={1}>
      <Typography variant="subtitle2">
        {title} {tooltip && <InfoTooltipIcon iconTooltipText={tooltip} />}
      </Typography>
      <Stack direction="row" gap={1}>
        {children}
      </Stack>
    </Stack>
  );
}

export function NodeLegend({
  nodeTypes,
  retractedNodeKeys = [],
}: {
  nodeTypes: string[];
  retractedNodeKeys?: string[];
}) {
  const nodeColors = useNodeColors();
  const theme = useTheme();
  return (
    <Legend title="Nodes Legend">
      {nodeTypesList
        .filter(([, key]) => nodeTypes.includes(key))
        .map(([name, key]) => (
          <NodeLegendItem name={name} key={key} nodeKey={key} bgColor={nodeColors[key]} />
        ))}
      {retractedNodeTypesList
        .filter(([, key]) => retractedNodeKeys.includes(key))
        .map(([name, key]) => (
          <NodeLegendItem
            name={name}
            key={`retracted-${key}`}
            nodeKey={key}
            bgColor={theme.palette.retracted.main}
            iconColor="white"
          />
        ))}
    </Legend>
  );
}

interface StatusLegendProps {
  statuses?: string[];
}

function StatusItem({ status }: { status: string }) {
  return (
    <Stack direction="row" gap={0.5} alignItems="center">
      <StatusIcon status={status} />
      <Typography variant="caption" textTransform="capitalize">
        {status}
      </Typography>
    </Stack>
  );
}

export function StatusLegend({ statuses }: StatusLegendProps) {
  return (
    <Legend title="Status Legend" tooltip="Hover on node status icon for additional status details">
      {statuses?.map((status) => (
        <StatusItem key={status} status={status} />
      ))}
    </Legend>
  );
}
