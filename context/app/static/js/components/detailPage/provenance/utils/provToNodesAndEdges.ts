import { Edge, MarkerType } from '@xyflow/react';
import theme from 'js/theme/theme';
import { ProvData } from '../types';

export interface NodeWithoutPosition {
  id: string;
  type: 'activity' | 'entity';
  data: {
    name: string;
    displayName: string;
    prov: Record<string, string>;
    isCurrentEntity?: boolean;
  };
}

function makeEdge(source: string, target: string): Edge {
  return {
    id: `${source}-${target}`,
    source,
    target,
    type: 'straight',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    style: { color: theme.palette.secondary.main },
  };
}

/**
 * Helper function to confirm that the provData object is valid
 */
function verifyProvData(provData?: ProvData): provData is ProvData {
  if (!provData) return false;
  return Boolean(provData.entity && provData.activity && provData.used && provData.wasGeneratedBy);
}

interface ConvertProvDataToNodesAndEdgesOptions {
  currentUuid: string;
  getNameForActivity: (id: string, prov?: ProvData) => string;
  getNameForEntity: (id: string, prov?: ProvData) => string;
  entityType?: string;
}

/**
 * Converts PROV-JSON data to ReactFlow nodes and edges
 * Filters out donor registration/creation activities (except for Donor entities)
 */
export function convertProvDataToNodesAndEdges(
  provData: ProvData | undefined,
  { currentUuid, getNameForActivity, getNameForEntity, entityType }: ConvertProvDataToNodesAndEdgesOptions,
): {
  nodes: NodeWithoutPosition[];
  edges: Edge[];
} {
  const nodes: NodeWithoutPosition[] = [];
  const edges: Edge[] = [];

  if (!verifyProvData(provData)) {
    return { nodes, edges };
  }

  const { entity, activity, used, wasGeneratedBy } = provData;

  // Create entity nodes
  Object.entries(entity).forEach(([entityId, entityData]) => {
    const name = getNameForEntity(entityId, provData);
    const displayName = name;

    nodes.push({
      id: entityId,
      type: 'entity',
      data: {
        name,
        displayName,
        prov: entityData,
        isCurrentEntity: entityData['hubmap:uuid'] === currentUuid,
      },
    });
  });

  // Create activity nodes and edges
  Object.entries(activity).forEach(([activityId, activityData]) => {
    const creationAction = activityData['hubmap:creation_action'];

    // Skip donor registration/creation activities unless viewing a Donor
    if (
      (creationAction === 'Register Donor Activity' || creationAction === 'Create Donor Activity') &&
      entityType !== 'Donor'
    ) {
      return;
    }

    const name = getNameForActivity(activityId, provData);
    // For activities, only show the creation action part (before the dash)
    const displayName = name.split(' - ')[0];

    nodes.push({
      id: activityId,
      type: 'activity',
      data: {
        name,
        displayName,
        prov: activityData,
      },
    });
  });

  // Create edges from 'used' relationships (entity -> activity)
  Object.values(used).forEach((edge) => {
    const activityId = edge['prov:activity'];
    const entityId = edge['prov:entity'];

    // Only create edge if both nodes exist (activity might have been filtered out)
    const activityExists = nodes.some((n) => n.id === activityId);
    const entityExists = nodes.some((n) => n.id === entityId);

    if (activityExists && entityExists) {
      edges.push(makeEdge(entityId, activityId));
    }
  });

  // Create edges from 'wasGeneratedBy' relationships (activity -> entity)
  Object.values(wasGeneratedBy).forEach((edge) => {
    const activityId = edge['prov:activity'];
    const entityId = edge['prov:entity'];

    // Only create edge if both nodes exist (activity might have been filtered out)
    const activityExists = nodes.some((n) => n.id === activityId);
    const entityExists = nodes.some((n) => n.id === entityId);

    if (activityExists && entityExists) {
      edges.push(makeEdge(activityId, entityId));
    }
  });

  return { nodes, edges };
}
