import { Node, Edge, MarkerType } from '@xyflow/react';
import Dagre from '@dagrejs/dagre';
import theme from 'js/theme/theme';
import { NodeWithoutPosition } from './types';
import { ProvData } from '../provenance/types';
import { nodeHeight } from './nodeTypes';

export function applyLayout(nodes: NodeWithoutPosition[], edges: Edge[]): { nodes: Node[]; edges: Edge[] } {
  if (nodes.length === 0 || !document) {
    return { nodes: nodes.map((n) => ({ ...n, position: { x: 0, y: 0 } })), edges };
  }
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: 'LR',
    ranksep: 100,
    marginx: 10,
    marginy: 10,
  });

  const parentNodes = new Map<string, string>();

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
    parentNodes.set(edge.target, edge.source);
  });
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 284,
      height: nodeHeight,
    }),
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      return { ...node, position } as Node;
    }),
    edges,
  };
}

export function generatePrefix(key: string) {
  return `hubmap:${key}`;
}

const entityPrefix = generatePrefix('entities');

export function getCurrentEntityNodeType(currentEntityIsComponent: boolean, currentEntityIsPrimary: boolean) {
  if (currentEntityIsPrimary) {
    return 'primaryDataset';
  }
  if (currentEntityIsComponent) {
    return 'componentDataset';
  }
  return 'processedDataset';
}

/**
 * Helper function to determine if a dataset type is forbidden
 * from being displayed in the dataset relationships graph
 *
 * @param datasetType the `dataset_type` property of a dataset entity
 * @returns boolean
 */
function datasetTypeIsForbidden(datasetType: string) {
  if (datasetType === 'Publication') {
    return true;
  }
  return false;
}

/**
 * Helper function to determine if an activity type is forbidden
 * from being displayed in the dataset relationships graph
 *
 * @param activityType the `creation_action` property of an activity entity
 * @returns boolean
 */
function activityTypeIsForbidden(activityType: string) {
  if (activityType === 'Create Publication Activity') {
    return true;
  }
  return false;
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
 * This is necessary to avoid errors with datasets that are missing provenance data
 * (e.g. datasets with invalid/error status)
 * @returns boolean
 */
function verifyProvData(provData?: ProvData): provData is ProvData {
  if (!provData) return false;
  return Boolean(provData.entity && provData.activity && provData.used && provData.wasGeneratedBy);
}

export function convertProvDataToNodesAndEdges(primaryDatasetUuid: string, provData?: ProvData) {
  const nodes: NodeWithoutPosition[] = [];
  const edges: Edge[] = [];
  if (verifyProvData(provData)) {
    const { entity, activity, used, wasGeneratedBy } = provData;
    // First, add the primary entity as the starting point
    const primaryDatasetUUID = `${entityPrefix}/${primaryDatasetUuid}`;
    const primaryEntity = entity[primaryDatasetUUID];
    if (!primaryEntity) {
      return { nodes, edges };
    }
    // Maintain a queue of entities to process
    const queuedEntities: string[] = [primaryDatasetUUID];
    const componentDatasets = new Set<string>();
    while (queuedEntities.length > 0) {
      const queuedActivities: string[] = [];
      const currentEntityUUID = queuedEntities.shift()!;
      const currentEntity = entity[currentEntityUUID];
      if (!currentEntity || datasetTypeIsForbidden(currentEntity[generatePrefix('dataset_type')])) {
        // eslint-disable-next-line no-continue
        continue;
      }
      // Find all activities that used this entity
      const entityChildActivityEdges = Object.values(used).filter((edge) => edge['prov:entity'] === currentEntityUUID);
      entityChildActivityEdges.forEach((edge) => {
        const activityUUID = edge['prov:activity'];
        if (!queuedActivities.includes(activityUUID)) {
          queuedActivities.push(activityUUID);
        }
      });
      // Determine the type of the current entity
      const currentEntityIsComponent = componentDatasets.has(currentEntityUUID);
      const currentEntityIsPrimary = currentEntityUUID === primaryDatasetUUID;
      const currentEntityType = getCurrentEntityNodeType(currentEntityIsComponent, currentEntityIsPrimary);

      // Add current entity as a node
      nodes.push({
        id: currentEntityUUID,
        type: currentEntityType,
        data: {
          name: currentEntity[generatePrefix('hubmap_id')],
          status: currentEntity[generatePrefix('status')],
          datasetType: currentEntity[generatePrefix('dataset_type')],
        },
      });
      // Iterate over all activities that used this entity
      queuedActivities.forEach((activityUUID) => {
        const currentActivity = activity[activityUUID];
        if (!currentActivity || activityTypeIsForbidden(currentActivity[generatePrefix('creation_action')])) {
          return;
        }
        // Find all entities that were generated by this activity and add them to the queue
        const activityChildEntityEdges = Object.values(wasGeneratedBy).filter(
          (edge) => edge['prov:activity'] === activityUUID,
        );

        // Since we can't tell if an activity node leads to a publication or image pyramid until we check its children,
        // we need to check if any of the children are forbidden before adding the activity node
        let hasForbiddenEntities = false;
        const edgesToAdd: Edge[] = [];
        const entitiesToQueue: string[] = [];
        activityChildEntityEdges.forEach((edge) => {
          if (hasForbiddenEntities) return;
          const entityUUID = edge['prov:entity'];
          if (!queuedEntities.includes(entityUUID)) {
            const queuedEntity = entity[entityUUID];
            if (!queuedEntity || datasetTypeIsForbidden(queuedEntity[generatePrefix('dataset_type')])) {
              hasForbiddenEntities = true;
              return;
            }
            if (currentActivity[generatePrefix('creation_action')] === 'Multi-Assay Split') {
              componentDatasets.add(entityUUID);
            }
            edgesToAdd.push(makeEdge(activityUUID, entityUUID));
            entitiesToQueue.push(entityUUID);
          }
        });

        if (hasForbiddenEntities) return;
        // Add edges and queue any new entities
        edges.push(...edgesToAdd);
        queuedEntities.push(...entitiesToQueue);
        // Add current activity as a node
        nodes.push({
          id: activityUUID,
          type: 'pipeline',
          data: {
            name: currentActivity[generatePrefix('creation_action')],
            status: currentActivity[generatePrefix('status')],
            childDatasets: activityChildEntityEdges.map((edge) => edge['prov:entity'].split('/')[1]),
            singleAssay: activityChildEntityEdges.length === 1,
          },
        });
        // Add edges between the current entity and the current activity
        edges.push(makeEdge(currentEntityUUID, activityUUID));
      });
    }
  }
  return { nodes, edges };
}
