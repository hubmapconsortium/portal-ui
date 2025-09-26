import { MultiDirectedGraph } from 'graphology';
import { graphlib, layout } from '@dagrejs/dagre';
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
   * Get visual properties for a node based on its type and subtype
   */
  private static getNodeVisualProperties(node: ProvNode): {
    color: string;
    size: number;
    nodeType: string;
  } {
    if (node.type === 'entity') {
      const entityType = (node.data['hubmap:entity_type'] as string) || '';

      if (entityType === 'Donor') {
        return {
          color: '#cdc5f3', // Light purple for Donors
          size: 15,
          nodeType: 'square',
        };
      } else {
        // Sample/Dataset
        return {
          color: '#d5eac3', // Light green for Samples/Datasets
          size: 15,
          nodeType: 'square',
        };
      }
    } else if (node.type === 'activity') {
      return {
        color: '#b0c4da', // Light blue for Activities
        size: 12,
        nodeType: 'circle',
      };
    } else if (node.type === 'agent') {
      return {
        color: '#ffd1dc', // Light pink for Agents
        size: 10,
        nodeType: 'circle',
      };
    }

    // Fallback
    return {
      color: '#cccccc',
      size: 10,
      nodeType: 'circle',
    };
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
      target: edgeData['prov:activity'],
      source: edgeData['prov:entity'],
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
      target: edgeData['prov:entity'],
      source: edgeData['prov:activity'],
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
      target: edgeData['prov:delegate'],
      source: edgeData['prov:responsible'],
      type: 'actedOnBehalfOf' as const,
      data: edgeData,
    }));
  }

  /**
   * Apply dagre layout to calculate node positions
   * Arranges nodes hierarchically with outputs on the right
   */
  private applyDagreLayout(graph: MultiDirectedGraph): void {
    // Create a new dagre graph
    const dagreGraph = new graphlib.Graph();
    dagreGraph.setGraph({
      rankdir: 'LR',
      nodesep: 20_000,
      ranksep: 1_000_000,
      marginx: 500,
      marginy: 500,
    });
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    // Add nodes to dagre graph with larger dimensions to account for visual size
    graph.forEachNode((nodeId, nodeData) => {
      dagreGraph.setNode(nodeId, {
        width: 100,
        height: 100,
      });
    });

    // Add edges to dagre graph
    graph.forEachEdge((edgeId, _edgeData, source, target) => {
      dagreGraph.setEdge(source, target);
    });

    // Apply layout
    layout(dagreGraph);

    // Update graph nodes with calculated positions
    graph.forEachNode((nodeId) => {
      const dagreNode = dagreGraph.node(nodeId);
      if (dagreNode) {
        graph.setNodeAttribute(nodeId, 'x', dagreNode.x);
        graph.setNodeAttribute(nodeId, 'y', dagreNode.y);
        graph.setNodeAttribute(nodeId, 'width', dagreNode.width);
        graph.setNodeAttribute(nodeId, 'height', dagreNode.height);
      }
    });
  }

  /**
   * Convert OpenProvenance data to a Graphology graph
   */
  public toGraph(): MultiDirectedGraph {
    const graph = new MultiDirectedGraph();

    // Create all nodes (excluding agents)
    const entityNodes = this.createEntityNodes();
    const activityNodes = this.createActivityNodes();
    // Note: We don't include agentNodes to hide them from visualization
    const allNodes = [...entityNodes, ...activityNodes];

    // Add nodes to graph
    allNodes.forEach((node) => {
      const visualProps = OpenProvParser.getNodeVisualProperties(node);

      graph.addNode(node.id, {
        label: node.label,
        type: node.type,
        subtype: node.subtype,
        data: node.data,
        // Sigma.js visual properties
        color: visualProps.color,
        size: visualProps.size,
        // Store the original prov type for potential custom rendering
        provType: visualProps.nodeType,
      });
    });

    // Create edges (excluding actedOnBehalfOf since agents are not displayed)
    const usedEdges = this.createUsedEdges();
    const wasGeneratedByEdges = this.createWasGeneratedByEdges();
    // Note: We exclude actedOnBehalfOfEdges since they typically connect to agents
    const allEdges = [...usedEdges, ...wasGeneratedByEdges];

    // Add edges to graph (only if both source and target nodes exist)
    // This automatically filters out any edges connecting to agents since agents aren't in the graph
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

    // Apply dagre layout to position nodes
    this.applyDagreLayout(graph);

    return graph;
  }

  /**
   * Get summary statistics about the parsed graph
   * Note: Agents and actedOnBehalfOf edges are excluded from the visualization
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
        agents: agentCount, // Still reported but not displayed
        // Only entities and activities are displayed in the graph
        displayed: entityCount + activityCount,
        total: entityCount + activityCount + agentCount,
      },
      edges: {
        used: usedCount,
        wasGeneratedBy: wasGeneratedByCount,
        actedOnBehalfOf: actedOnBehalfOfCount, // Still reported but not displayed
        // Only used and wasGeneratedBy edges are displayed in the graph
        displayed: usedCount + wasGeneratedByCount,
        total: usedCount + wasGeneratedByCount + actedOnBehalfOfCount,
      },
    };
  }
}

/**
 * Convenience function to parse OpenProvenance data to a Graphology graph with dagre layout
 */
export function parseOpenProvToGraph(
  prov: ProvData,
  options: {
    getNameForEntity?: (id: string, prov?: ProvData) => string;
    getNameForActivity?: (id: string, prov?: ProvData) => string;
  } = {},
): MultiDirectedGraph {
  const parser = new OpenProvParser(prov, options);
  return parser.toGraph();
}
