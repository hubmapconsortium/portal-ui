import { convertProvDataToNodesAndEdges, generatePrefix, getCurrentEntityNodeType, makeNodeHref } from './utils';

import { provData, nodes, edges } from './prov.fixtures';

describe('generatePrefix', () => {
  it('should return the property name with the `hubmap:` prefix', () => {
    expect(generatePrefix('hubmap_id')).toBe('hubmap:hubmap_id');
    expect(generatePrefix('status')).toBe('hubmap:status');
    expect(generatePrefix('dataset_type')).toBe('hubmap:dataset_type');
  });
});

describe('getCurrentEntityNodeType', () => {
  test.each([
    { currentEntityIsComponent: true, currentEntityIsPrimary: true, expected: 'primaryDataset' },
    { currentEntityIsComponent: true, currentEntityIsPrimary: false, expected: 'componentDataset' },
    { currentEntityIsComponent: false, currentEntityIsPrimary: true, expected: 'primaryDataset' },
    { currentEntityIsComponent: false, currentEntityIsPrimary: false, expected: 'processedDataset' },
  ])(
    'should return the correct node type based on the provided flags',
    ({ currentEntityIsComponent, currentEntityIsPrimary, expected }) => {
      expect(getCurrentEntityNodeType(currentEntityIsComponent, currentEntityIsPrimary)).toBe(expected);
    },
  );
});

describe('convertProvDataToNodesAndEdges', () => {
  it('should format the provided ProvData into nodes and edges', () => {
    const { nodes: expectedNodes, edges: expectedEdges } = convertProvDataToNodesAndEdges(
      '6df2f796ad72307d04dc94d688b725c5',
      provData,
    );
    expect(nodes).toEqual(expectedNodes);
    expect(edges).toEqual(expectedEdges);
  });
});

describe('makeNodeHref', () => {
  it('should return a hash link for the provided node ID', () => {
    const testPipeline = {
      pipeline: 'Test Pipeline',
      hubmap_id: 'HBM123',
      status: 'Published',
    };
    expect(makeNodeHref(testPipeline)).toBe('#section-HBM123');
  });
  it('should handle missing data by returning undefined', () => {
    expect(makeNodeHref(undefined)).toBe(undefined);
  });
});
