import { DirectedGraph } from 'graphology';
import type { ProvData, ProvEdge as ProvDataEdge } from '../types';

export interface ProvNode {
  id: string;
  label: string;
  type: 'entity' | 'activity' | 'agent';
  subtype: string;
  data: Record<string, unknown>;
}

export interface ProvEdge {
  id: string;
  source: string;
  target: string;
  type: 'used' | 'wasGeneratedBy' | 'actedOnBehalfOf';
  data: ProvDataEdge | Record<string, string>;
}

/**
 * Parser that converts OpenProvenance format data to a Graphology graph instance
 */
export class OpenProvParser {
  private prov: ProvData;

  private getNameForEntity: (id: string) => string;

  private getNameForActivity: (id: string) => string;

  constructor(
    prov: ProvData,
    options: {
      getNameForEntity?: (id: string, prov?: ProvData) => string;
      getNameForActivity?: (id: string, prov?: ProvData) => string;
    } = {},
  ) {
    this.prov = prov;
    // Handle the case where the function signature expects 2 params but we might only use 1
    this.getNameForEntity = options.getNameForEntity
      ? (id: string) => options.getNameForEntity!(id, this.prov)
      : OpenProvParser.extractNameFromId;
    this.getNameForActivity = options.getNameForActivity
      ? (id: string) => options.getNameForActivity!(id, this.prov)
      : OpenProvParser.extractNameFromId;
  }

  /**
   * Extract a human-readable name from a hubmap ID
   */
  private static extractNameFromId = (id: string): string => {
    // Extract HubMAP ID from the full URI if it exists
    const regex = /hubmap_id['"]?\s*:\s*['"]?([^'",\s}]+)/;
    const match = regex.exec(id);
    if (match) {
      return match[1];
    }

    // Fallback to extracting from the ID itself
    const parts = id.split('/');
    return parts[parts.length - 1] || id;
  };

  /**
   * Determine the entity subtype based on its properties
   */
  private static getEntitySubtype(entityData: Record<string, unknown>): string {
    const entityType = entityData['hubmap:entity_type'] as string;
    const datasetType = entityData['hubmap:dataset_type'] as string;
    const sampleCategory = entityData['hubmap:sample_category'] as string;

    if (entityType === 'Dataset') {
      return datasetType || 'Dataset';
    }
    if (entityType === 'Sample') {
      return sampleCategory ? `Sample (${sampleCategory})` : 'Sample';
    }
    if (entityType === 'Donor') {
      return 'Donor';
    }

    return entityType || 'Entity';
  }

  /**
   * Determine the activity subtype based on its properties
   */
  private static getActivitySubtype(activityData: Record<string, unknown>): string {
    const creationAction = activityData['hubmap:creation_action'] as string;
    const label = activityData['hubmap:label'] as string;

    return creationAction || label || 'Activity';
  }

  /**
   * Determine the agent subtype based on its properties
   */
  private static getAgentSubtype(agentData: Record<string, unknown>): string {
    const provType = agentData['prov:type'];

    if (typeof provType === 'object' && provType !== null) {
      const typeValue = (provType as Record<string, string>).$;
      if (typeValue === 'prov:Person') return 'Person';
      if (typeValue === 'prov:Organization') return 'Organization';
    }

    return 'Agent';
  }

  /**
   * Create nodes for entities
   */
  private createEntityNodes(): ProvNode[] {
    return Object.entries(this.prov.entity || {}).map(([entityId, entityData]) => ({
      id: entityId,
      label: this.getNameForEntity(entityId),
      type: 'entity' as const,
      subtype: OpenProvParser.getEntitySubtype(entityData),
      data: entityData,
    }));
  }

  /**
   * Create nodes for activities
   */
  private createActivityNodes(): ProvNode[] {
    return Object.entries(this.prov.activity || {}).map(([activityId, activityData]) => ({
      id: activityId,
      label: this.getNameForActivity(activityId),
      type: 'activity' as const,
      subtype: OpenProvParser.getActivitySubtype(activityData),
      data: activityData,
    }));
  }

  /**
   * Create nodes for agents
   */
  private createAgentNodes(): ProvNode[] {
    return Object.entries(this.prov.agent || {}).map(([agentId, agentData]) => ({
      id: agentId,
      label: (agentData['hubmap:userDisplayName'] ?? agentData['hubmap:groupName'] ?? agentId) as string,
      type: 'agent' as const,
      subtype: OpenProvParser.getAgentSubtype(agentData),
      data: agentData,
    }));
  }

  /**
   * Create edges for 'used' relationships (activity -> entity)
   */
  private createUsedEdges(): ProvEdge[] {
    return Object.entries(this.prov.used || {}).map(([edgeId, edgeData]) => ({
      id: edgeId,
      source: edgeData['prov:activity'],
      target: edgeData['prov:entity'],
      type: 'used' as const,
      data: edgeData,
    }));
  }

  /**
   * Create edges for 'wasGeneratedBy' relationships (entity -> activity)
   */
  private createWasGeneratedByEdges(): ProvEdge[] {
    return Object.entries(this.prov.wasGeneratedBy || {}).map(([edgeId, edgeData]) => ({
      id: edgeId,
      source: edgeData['prov:entity'],
      target: edgeData['prov:activity'],
      type: 'wasGeneratedBy' as const,
      data: edgeData,
    }));
  }

  /**
   * Create edges for 'actedOnBehalfOf' relationships
   */
  private createActedOnBehalfOfEdges(): ProvEdge[] {
    return Object.entries(this.prov.actedOnBehalfOf || {}).map(([edgeId, edgeData]) => ({
      id: edgeId,
      source: edgeData['prov:delegate'],
      target: edgeData['prov:responsible'],
      type: 'actedOnBehalfOf' as const,
      data: edgeData,
    }));
  }

  /**
   * Convert OpenProvenance data to a Graphology graph
   */
  public toGraph(): DirectedGraph {
    const graph = new DirectedGraph();

    // Create all nodes
    const entityNodes = this.createEntityNodes();
    const activityNodes = this.createActivityNodes();
    const agentNodes = this.createAgentNodes();
    const allNodes = [...entityNodes, ...activityNodes, ...agentNodes];

    // Add nodes to graph
    allNodes.forEach((node) => {
      graph.addNode(node.id, {
        label: node.label,
        type: node.type,
        subtype: node.subtype,
        data: node.data,
      });
    });

    // Create all edges
    const usedEdges = this.createUsedEdges();
    const wasGeneratedByEdges = this.createWasGeneratedByEdges();
    const actedOnBehalfOfEdges = this.createActedOnBehalfOfEdges();
    const allEdges = [...usedEdges, ...wasGeneratedByEdges, ...actedOnBehalfOfEdges];

    // Add edges to graph (only if both source and target nodes exist)
    allEdges.forEach((edge) => {
      if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
        try {
          graph.addEdge(edge.source, edge.target, {
            id: edge.id,
            type: edge.type,
            data: edge.data,
          });
        } catch (error) {
          // Handle potential duplicate edges or other issues
          console.warn(`Failed to add edge ${edge.id}:`, error);
        }
      } else {
        console.warn(`Skipping edge ${edge.id}: missing source (${edge.source}) or target (${edge.target})`);
      }
    });

    return graph;
  }

  /**
   * Get summary statistics about the parsed graph
   */
  public getStats() {
    const entityCount = Object.keys(this.prov.entity || {}).length;
    const activityCount = Object.keys(this.prov.activity || {}).length;
    const agentCount = Object.keys(this.prov.agent || {}).length;
    const usedCount = Object.keys(this.prov.used || {}).length;
    const wasGeneratedByCount = Object.keys(this.prov.wasGeneratedBy || {}).length;
    const actedOnBehalfOfCount = Object.keys(this.prov.actedOnBehalfOf || {}).length;

    return {
      nodes: {
        entities: entityCount,
        activities: activityCount,
        agents: agentCount,
        total: entityCount + activityCount + agentCount,
      },
      edges: {
        used: usedCount,
        wasGeneratedBy: wasGeneratedByCount,
        actedOnBehalfOf: actedOnBehalfOfCount,
        total: usedCount + wasGeneratedByCount + actedOnBehalfOfCount,
      },
    };
  }
}

/**
 * Convenience function to parse OpenProvenance data to a Graphology graph
 */
export function parseOpenProvToGraph(
  prov: ProvData,
  options: {
    getNameForEntity?: (id: string, prov?: ProvData) => string;
    getNameForActivity?: (id: string, prov?: ProvData) => string;
  } = {},
): DirectedGraph {
  const parser = new OpenProvParser(prov, options);
  return parser.toGraph();
}
