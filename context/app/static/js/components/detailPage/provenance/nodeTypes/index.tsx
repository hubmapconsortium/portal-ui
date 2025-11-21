import React from 'react';
import { Node, NodeProps, NodeTypes } from '@xyflow/react';
import { DatasetIcon } from 'js/shared-styles/icons';
import { PlayArrowRounded } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { NodeTemplate } from './NodeTemplate';

interface EntityNodeData extends Record<string, unknown> {
  name: string;
  displayName: string;
  prov: Record<string, string>;
  isCurrentEntity?: boolean;
}

interface ActivityNodeData extends Record<string, unknown> {
  name: string;
  displayName: string;
  prov: Record<string, string>;
}

type EntityNodeType = Node<EntityNodeData, 'entity'>;
type ActivityNodeType = Node<ActivityNodeData, 'activity'>;

export function useNodeColors() {
  const theme = useTheme();
  return {
    entity: theme.palette.accent.info90,
    activity: theme.palette.accent.primary90,
  };
}

export const nodeIcons = {
  entity: DatasetIcon,
  activity: PlayArrowRounded,
};

export const nodeHeight = 70;

function EntityNode({ data }: NodeProps<EntityNodeType>) {
  const colors = useNodeColors();
  const { displayName, isCurrentEntity } = data;

  return (
    <NodeTemplate
      source
      target
      rounded
      icon={nodeIcons.entity}
      displayName={displayName}
      bgColor={colors.entity}
      showAsterisk={isCurrentEntity}
      tooltipText={data.name}
    />
  );
}

function ActivityNode({ data }: NodeProps<ActivityNodeType>) {
  const colors = useNodeColors();
  const { displayName } = data;

  return (
    <NodeTemplate
      source
      target
      icon={nodeIcons.activity}
      displayName={displayName}
      bgColor={colors.activity}
      tooltipText={data.name}
    />
  );
}

export const nodeTypes: NodeTypes = {
  entity: EntityNode,
  activity: ActivityNode,
};
