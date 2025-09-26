import { OpenProvParser } from '../OpenProvParser';

describe('OpenProvParser', () => {
  const mockProvData = {
    entity: {
      ent1: {
        'hubmap:entity_type': 'Dataset',
        'hubmap:dataset_type': 'RNAseq',
        hubmap_id: 'HBM123.ABC.001',
      },
      ent2: {
        'hubmap:entity_type': 'Sample',
        'hubmap:sample_category': 'block',
        hubmap_id: 'HBM123.DEF.002',
      },
    },
    activity: {
      act1: {
        'hubmap:creation_action': 'Multi-assay split',
        'hubmap:label': 'Processing Activity',
      },
    },
    agent: {
      agent1: {
        'hubmap:userDisplayName': 'Test User',
        'prov:type': { $: 'prov:Person' },
      },
    },
    used: {
      used1: {
        'prov:activity': 'act1',
        'prov:entity': 'ent2',
      },
    },
    wasGeneratedBy: {
      gen1: {
        'prov:entity': 'ent1',
        'prov:activity': 'act1',
      },
    },
    actedOnBehalfOf: {
      behalf1: {
        'prov:delegate': 'agent1',
        'prov:responsible': 'agent1',
      },
    },
  };

  it('should create a graph with nodes and edges', () => {
    const parser = new OpenProvParser(mockProvData);
    const graph = parser.toGraph();

    expect(graph.order).toBe(3); // 2 entities + 1 activity (agents are excluded)
    expect(graph.size).toBe(2); // used + wasGeneratedBy edges (actedOnBehalfOf excluded)
  });

  it('should apply dagre layout with x/y coordinates', () => {
    const parser = new OpenProvParser(mockProvData);
    const graph = parser.toGraph();

    // Check that all nodes have x/y coordinates
    graph.forEachNode((nodeId, nodeData) => {
      expect(typeof nodeData.x).toBe('number');
      expect(typeof nodeData.y).toBe('number');
      expect(typeof nodeData.width).toBe('number');
      expect(typeof nodeData.height).toBe('number');

      // Ensure coordinates are reasonable (not NaN or Infinity)
      expect(Number.isFinite(nodeData.x)).toBe(true);
      expect(Number.isFinite(nodeData.y)).toBe(true);
      expect(nodeData.width).toBeGreaterThan(0);
      expect(nodeData.height).toBeGreaterThan(0);
    });
  });

  it('should arrange nodes with proper layout', () => {
    const parser = new OpenProvParser(mockProvData);
    const graph = parser.toGraph();

    // Get node positions
    const ent1Data = graph.getNodeAttributes('ent1'); // Output entity
    const ent2Data = graph.getNodeAttributes('ent2'); // Input entity
    const act1Data = graph.getNodeAttributes('act1'); // Activity

    // Just verify that all nodes have different positions (dagre has positioned them)
    expect(ent1Data.x).not.toBe(ent2Data.x);
    expect(ent1Data.x).not.toBe(act1Data.x);
    expect(ent2Data.x).not.toBe(act1Data.x);

    // And that y positions can also vary
    // This confirms that dagre is actually laying out the graph
    expect(typeof ent1Data.y).toBe('number');
    expect(typeof ent2Data.y).toBe('number');
    expect(typeof act1Data.y).toBe('number');
  });

  it('should maintain node properties after layout', () => {
    const parser = new OpenProvParser(mockProvData);
    const graph = parser.toGraph();

    // Check that original node data is preserved
    const ent1Data = graph.getNodeAttributes('ent1');
    expect(ent1Data.type).toBe('entity');
    expect(ent1Data.subtype).toBe('RNAseq');
    expect(ent1Data.label).toBe('ent1'); // Default name extraction fallback

    const act1Data = graph.getNodeAttributes('act1');
    expect(act1Data.type).toBe('activity');
    expect(act1Data.subtype).toBe('Multi-assay split');
  });

  it('should provide layout statistics', () => {
    const parser = new OpenProvParser(mockProvData);
    const stats = parser.getStats();

    expect(stats.nodes.entities).toBe(2);
    expect(stats.nodes.activities).toBe(1);
    expect(stats.nodes.agents).toBe(1); // Still counted but not displayed
    expect(stats.nodes.displayed).toBe(3); // Only entities + activities displayed
    expect(stats.nodes.total).toBe(4);
    expect(stats.edges.used).toBe(1);
    expect(stats.edges.wasGeneratedBy).toBe(1);
    expect(stats.edges.actedOnBehalfOf).toBe(1); // Still counted but not displayed
    expect(stats.edges.displayed).toBe(2); // Only used + wasGeneratedBy displayed
    expect(stats.edges.total).toBe(3);
  });

  it('should handle custom name extractors', () => {
    const customEntityName = jest.fn(() => 'Custom Entity');
    const customActivityName = jest.fn(() => 'Custom Activity');

    const parser = new OpenProvParser(mockProvData, {
      getNameForEntity: customEntityName,
      getNameForActivity: customActivityName,
    });

    const graph = parser.toGraph();

    expect(customEntityName).toHaveBeenCalled();
    expect(customActivityName).toHaveBeenCalled();

    const ent1Data = graph.getNodeAttributes('ent1');
    expect(ent1Data.label).toBe('Custom Entity');

    const act1Data = graph.getNodeAttributes('act1');
    expect(act1Data.label).toBe('Custom Activity');
  });
});
