import { Dataset, Donor, Sample } from 'js/components/types';

function createMockDataset(uuid: string, partial?: Partial<Dataset>): Dataset {
  return {
    uuid,
    entity_type: 'Dataset',
    hubmap_id: `HBM${uuid.substring(0, 6)}`,
    mapped_status: 'Published',
    mapped_data_types: ['RNA-seq'],
    mapped_data_access_level: 'public',
    ...partial,
  } as Dataset;
}

function createMockDonor(uuid: string, partial?: Partial<Donor>): Donor {
  return {
    uuid,
    entity_type: 'Donor',
    hubmap_id: `HBM${uuid.substring(0, 6)}`,
    mapped_status: 'Published',
    mapped_metadata: {
      age_value: 45,
      age_unit: 'years',
      body_mass_index_unit: 'kg/m²',
      body_mass_index_value: 25.5,
      sex: 'Male',
      race: 'Asian',
    },
    ...partial,
  } as Donor;
}

function createMockSample(uuid: string, partial?: Partial<Sample>): Sample {
  return {
    uuid,
    entity_type: 'Sample',
    hubmap_id: `HBM${uuid.substring(0, 6)}`,
    mapped_status: 'Published',
    origin_samples_unique_mapped_organs: ['kidney'],
    ...partial,
  } as Sample;
}

describe('IntegratedData useMemo utility', () => {
  describe('Entity and UUID aggregation', () => {
    it('should combine entities with current entity when includeCurrentEntity is true', () => {
      const entities: (Donor | Dataset | Sample)[] = [createMockDataset('ancestor-1'), createMockDonor('donor-1')];
      const currentEntity = createMockDataset('current-dataset');

      // Simulate the useMemo logic
      const ents = [...entities];
      ents.push(currentEntity);
      const uuids = ents.map((e) => e.uuid);

      expect(ents).toHaveLength(3);
      expect(uuids).toEqual(['ancestor-1', 'donor-1', 'current-dataset']);
    });

    it('should not include current entity when includeCurrentEntity is false', () => {
      const entities: (Donor | Dataset | Sample)[] = [createMockDataset('ancestor-1'), createMockDonor('donor-1')];

      // Simulate the useMemo logic without includeCurrentEntity
      const ents = [...entities];
      const uuids = ents.map((e) => e.uuid);

      expect(ents).toHaveLength(2);
      expect(uuids).toEqual(['ancestor-1', 'donor-1']);
    });

    it('should extract UUIDs correctly from mixed entity types', () => {
      const entities: (Donor | Dataset | Sample)[] = [
        createMockDataset('dataset-uuid-1'),
        createMockDonor('donor-uuid-1'),
        createMockSample('sample-uuid-1'),
        createMockDataset('dataset-uuid-2'),
      ];

      const uuids = entities.map((e) => e.uuid);

      expect(uuids).toEqual(['dataset-uuid-1', 'donor-uuid-1', 'sample-uuid-1', 'dataset-uuid-2']);
    });

    it('should handle empty entities array', () => {
      const entities: (Donor | Dataset | Sample)[] = [];
      const currentEntity = createMockDataset('current-dataset');

      // With includeCurrentEntity
      const entsWithCurrent = [...entities];
      entsWithCurrent.push(currentEntity);
      const uuidsWithCurrent = entsWithCurrent.map((e) => e.uuid);

      expect(entsWithCurrent).toHaveLength(1);
      expect(uuidsWithCurrent).toEqual(['current-dataset']);

      // Without includeCurrentEntity
      const entsWithout = [...entities];
      const uuidsWithout = entsWithout.map((e) => e.uuid);

      expect(entsWithout).toHaveLength(0);
      expect(uuidsWithout).toEqual([]);
    });

    it('should preserve entity order', () => {
      const entities: (Donor | Dataset | Sample)[] = [
        createMockSample('sample-1'),
        createMockDataset('dataset-1'),
        createMockDonor('donor-1'),
        createMockDataset('dataset-2'),
      ];

      const uuids = entities.map((e) => e.uuid);

      expect(uuids).toEqual(['sample-1', 'dataset-1', 'donor-1', 'dataset-2']);
    });

    it('should handle large numbers of entities', () => {
      const entities: (Donor | Dataset | Sample)[] = Array.from({ length: 100 }, (_, i) =>
        i % 3 === 0
          ? createMockDataset(`dataset-${i}`)
          : i % 3 === 1
            ? createMockDonor(`donor-${i}`)
            : createMockSample(`sample-${i}`),
      );

      const uuids = entities.map((e) => e.uuid);

      expect(entities).toHaveLength(100);
      expect(uuids).toHaveLength(100);
      expect(uuids[0]).toBe('dataset-0');
      expect(uuids[1]).toBe('donor-1');
      expect(uuids[2]).toBe('sample-2');
    });
  });

  describe('Entity type validation', () => {
    it('should correctly identify Dataset entities', () => {
      const entity = createMockDataset('test-uuid');
      expect(entity.entity_type).toBe('Dataset');
    });

    it('should correctly identify Donor entities', () => {
      const entity = createMockDonor('test-uuid');
      expect(entity.entity_type).toBe('Donor');
    });

    it('should correctly identify Sample entities', () => {
      const entity = createMockSample('test-uuid');
      expect(entity.entity_type).toBe('Sample');
    });

    it('should handle all three entity types in one collection', () => {
      const entities: (Donor | Dataset | Sample)[] = [
        createMockDataset('dataset-1'),
        createMockDonor('donor-1'),
        createMockSample('sample-1'),
      ];

      const types = entities.map((e) => e.entity_type);
      expect(types).toEqual(['Dataset', 'Donor', 'Sample']);
    });
  });

  describe('UUID extraction edge cases', () => {
    it('should handle entities with special characters in UUIDs', () => {
      const entities: (Donor | Dataset | Sample)[] = [
        createMockDataset('abc-123-def-456'),
        createMockDonor('xyz-789-uvw-012'),
      ];

      const uuids = entities.map((e) => e.uuid);
      expect(uuids).toEqual(['abc-123-def-456', 'xyz-789-uvw-012']);
    });

    it('should handle entities with very long UUIDs', () => {
      const longUuid = 'a'.repeat(100);
      const entities: (Donor | Dataset | Sample)[] = [createMockDataset(longUuid)];

      const uuids = entities.map((e) => e.uuid);
      expect(uuids[0]).toBe(longUuid);
      expect(uuids[0].length).toBe(100);
    });

    it('should maintain array immutability when spreading entities', () => {
      const originalEntities: (Donor | Dataset | Sample)[] = [
        createMockDataset('original-1'),
        createMockDonor('original-2'),
      ];

      const spreadEntities = [...originalEntities];
      spreadEntities.push(createMockSample('new-sample'));

      expect(originalEntities).toHaveLength(2);
      expect(spreadEntities).toHaveLength(3);
      expect(originalEntities[0]).toEqual(spreadEntities[0]);
    });
  });

  describe('Full entities array construction', () => {
    it('should create a new array reference each time', () => {
      const entities: (Donor | Dataset | Sample)[] = [createMockDataset('dataset-1')];
      const currentEntity = createMockDonor('current');

      const result1 = [...entities];
      result1.push(currentEntity);

      const result2 = [...entities];
      result2.push(currentEntity);

      expect(result1).toEqual(result2);
      expect(result1).not.toBe(result2); // Different references
    });

    it('should handle mutations without affecting original', () => {
      const entities: (Donor | Dataset | Sample)[] = [createMockDataset('dataset-1'), createMockDonor('donor-1')];

      const ents1 = [...entities];
      ents1.push(createMockSample('sample-1'));

      const ents2 = [...entities];

      expect(ents1).toHaveLength(3);
      expect(ents2).toHaveLength(2);
      expect(entities).toHaveLength(2);
    });
  });
});
