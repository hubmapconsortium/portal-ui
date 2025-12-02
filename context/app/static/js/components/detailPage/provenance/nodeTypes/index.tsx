import React from 'react';
import { Node, NodeProps, NodeTypes } from '@xyflow/react';
import { DatasetIcon, DonorIcon, PublicationIcon, SampleIcon } from 'js/shared-styles/icons';
import { SvgIconComponent } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { NodeTemplate } from './NodeTemplate';

interface EntityNodeData extends Record<string, unknown> {
  name: string;
  displayName: string;
  prov: Record<string, string>;
  isCurrentEntity?: boolean;
  isSelected?: boolean;
}

interface ActivityNodeData extends Record<string, unknown> {
  name: string;
  displayName: string;
  prov: Record<string, string>;
  isSelected?: boolean;
}

type EntityNodeType = Node<EntityNodeData, 'entity'>;
type ActivityNodeType = Node<ActivityNodeData, 'activity'>;

export function useNodeEntityType(prov: Record<string, string>): ProvNodeType | null {
  if ('hubmap:entity_type' in prov) {
    return prov['hubmap:entity_type'].toLowerCase() as ProvNodeType;
  }
  return null;
}

type ProvNodeType = 'donor' | 'sample' | 'dataset' | 'publication' | 'activity';

export function useNodeColors(): Record<ProvNodeType, string> {
  const theme = useTheme();
  return {
    donor: theme.palette.provenance.input,
    sample: theme.palette.provenance.output,
    dataset: theme.palette.provenance.output,
    publication: theme.palette.provenance.output,
    activity: theme.palette.provenance.step,
  };
}

export const nodeIcons: Record<ProvNodeType, SvgIconComponent | undefined> = {
  donor: DonorIcon,
  sample: SampleIcon,
  dataset: DatasetIcon,
  publication: PublicationIcon,
  activity: undefined, // No icon for activity nodes
};

export const nodeHeight = 70;

function EntityNode({ data }: NodeProps<EntityNodeType>) {
  const colors = useNodeColors();
  const { displayName, isCurrentEntity, isSelected, prov } = data;

  const entityType = useNodeEntityType(prov);

  return (
    <NodeTemplate
      source
      target
      rounded
      icon={entityType ? nodeIcons[entityType] : undefined}
      displayName={displayName}
      bgColor={colors && entityType ? colors[entityType] : undefined}
      showAsterisk={isCurrentEntity}
      tooltipText={data.name}
      isSelected={isSelected}
    />
  );
}

function ActivityNode({ data }: NodeProps<ActivityNodeType>) {
  const colors = useNodeColors();
  const { displayName, isSelected } = data;

  return (
    <NodeTemplate
      source
      target
      displayName={displayName}
      bgColor={colors.activity}
      tooltipText={data.name}
      isSelected={isSelected}
    />
  );
}

export const nodeTypes: NodeTypes = {
  entity: EntityNode,
  activity: ActivityNode,
};
