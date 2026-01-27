import { Dataset, Donor, Sample, Entity } from 'js/components/types';

// Helper function to create mock entities
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

describe('IntegratedDataTables utility functions', () => {
  describe('Entity grouping by type', () => {
    it('should correctly group mixed entities by type', () => {
      const entities: Entity[] = [
        createMockDataset('dataset-1'),
        createMockDonor('donor-1'),
        createMockSample('sample-1'),
        createMockDataset('dataset-2'),
        createMockDonor('donor-2'),
      ];

      // Simulate the useMemo logic from IntegratedDataTables
      const integratedEntityList = entities.filter((e) => ['Donor', 'Sample', 'Dataset'].includes(e.entity_type));

      const entityIdsByType = integratedEntityList.reduce<Record<'Donor' | 'Sample' | 'Dataset', string[]>>(
        (acc, curr) => {
          if (curr.entity_type === 'Donor' || curr.entity_type === 'Sample' || curr.entity_type === 'Dataset') {
            acc[curr.entity_type].push(curr.uuid);
          }
          return acc;
        },
        {
          Donor: [],
          Sample: [],
          Dataset: [],
        },
      );

      expect(entityIdsByType).toEqual({
        Dataset: ['dataset-1', 'dataset-2'],
        Donor: ['donor-1', 'donor-2'],
        Sample: ['sample-1'],
      });
    });

    it('should handle empty entity list', () => {
      const entities: Entity[] = [];

      const integratedEntityList = entities.filter((e) => ['Donor', 'Sample', 'Dataset'].includes(e.entity_type));

      const entityIdsByType = integratedEntityList.reduce<Record<'Donor' | 'Sample' | 'Dataset', string[]>>(
        (acc, curr) => {
          if (curr.entity_type === 'Donor' || curr.entity_type === 'Sample' || curr.entity_type === 'Dataset') {
            acc[curr.entity_type].push(curr.uuid);
          }
          return acc;
        },
        {
          Donor: [],
          Sample: [],
          Dataset: [],
        },
      );

      expect(entityIdsByType).toEqual({
        Dataset: [],
        Donor: [],
        Sample: [],
      });
    });

    it('should handle only one type of entity', () => {
      const entities: Entity[] = [
        createMockDataset('dataset-1'),
        createMockDataset('dataset-2'),
        createMockDataset('dataset-3'),
      ];

      const integratedEntityList = entities.filter((e) => ['Donor', 'Sample', 'Dataset'].includes(e.entity_type));

      const entityIdsByType = integratedEntityList.reduce<Record<'Donor' | 'Sample' | 'Dataset', string[]>>(
        (acc, curr) => {
          if (curr.entity_type === 'Donor' || curr.entity_type === 'Sample' || curr.entity_type === 'Dataset') {
            acc[curr.entity_type].push(curr.uuid);
          }
          return acc;
        },
        {
          Donor: [],
          Sample: [],
          Dataset: [],
        },
      );

      expect(entityIdsByType).toEqual({
        Dataset: ['dataset-1', 'dataset-2', 'dataset-3'],
        Donor: [],
        Sample: [],
      });
    });

    it('should filter out non-integrated entity types', () => {
      const entities = [
        createMockDataset('dataset-1'),
        { entity_type: 'Collection', uuid: 'collection-1' } as Entity,
        createMockDonor('donor-1'),
        { entity_type: 'Publication', uuid: 'publication-1' } as Entity,
      ];

      const integratedEntityList = entities.filter((e) => ['Donor', 'Sample', 'Dataset'].includes(e.entity_type));

      const entityIdsByType = integratedEntityList.reduce<Record<'Donor' | 'Sample' | 'Dataset', string[]>>(
        (acc, curr) => {
          if (curr.entity_type === 'Donor' || curr.entity_type === 'Sample' || curr.entity_type === 'Dataset') {
            acc[curr.entity_type].push(curr.uuid);
          }
          return acc;
        },
        {
          Donor: [],
          Sample: [],
          Dataset: [],
        },
      );

      expect(entityIdsByType).toEqual({
        Dataset: ['dataset-1'],
        Donor: ['donor-1'],
        Sample: [],
      });
    });

    it('should preserve entity order within each type', () => {
      const entities: Entity[] = [
        createMockDataset('dataset-3'),
        createMockDataset('dataset-1'),
        createMockDonor('donor-2'),
        createMockDataset('dataset-2'),
        createMockDonor('donor-1'),
      ];

      const integratedEntityList = entities.filter((e) => ['Donor', 'Sample', 'Dataset'].includes(e.entity_type));

      const entityIdsByType = integratedEntityList.reduce<Record<'Donor' | 'Sample' | 'Dataset', string[]>>(
        (acc, curr) => {
          if (curr.entity_type === 'Donor' || curr.entity_type === 'Sample' || curr.entity_type === 'Dataset') {
            acc[curr.entity_type].push(curr.uuid);
          }
          return acc;
        },
        {
          Donor: [],
          Sample: [],
          Dataset: [],
        },
      );

      // Order should match the order entities were encountered
      expect(entityIdsByType).toEqual({
        Dataset: ['dataset-3', 'dataset-1', 'dataset-2'],
        Donor: ['donor-2', 'donor-1'],
        Sample: [],
      });
    });
  });

  describe('isIntegratedEntity type guard', () => {
    const isIntegratedEntity = (e: Entity): e is Donor | Sample | Dataset => {
      return ['Donor', 'Sample', 'Dataset'].includes(e.entity_type);
    };

    it('should return true for Dataset entities', () => {
      const dataset = createMockDataset('test-uuid');
      expect(isIntegratedEntity(dataset)).toBe(true);
    });

    it('should return true for Donor entities', () => {
      const donor = createMockDonor('test-uuid');
      expect(isIntegratedEntity(donor)).toBe(true);
    });

    it('should return true for Sample entities', () => {
      const sample = createMockSample('test-uuid');
      expect(isIntegratedEntity(sample)).toBe(true);
    });

    it('should return false for Collection entities', () => {
      const collection = { entity_type: 'Collection', uuid: 'test-uuid' } as Entity;
      expect(isIntegratedEntity(collection)).toBe(false);
    });

    it('should return false for Publication entities', () => {
      const publication = { entity_type: 'Publication', uuid: 'test-uuid' } as Entity;
      expect(isIntegratedEntity(publication)).toBe(false);
    });

    it('should return false for Support entities', () => {
      const support = { entity_type: 'Support', uuid: 'test-uuid' } as Entity;
      expect(isIntegratedEntity(support)).toBe(false);
    });
  });

  describe('Entity ID extraction', () => {
    it('should extract UUIDs from entities', () => {
      const entities: Entity[] = [createMockDataset('uuid-1'), createMockDonor('uuid-2'), createMockSample('uuid-3')];

      const uuids = entities.map((e) => e.uuid);

      expect(uuids).toEqual(['uuid-1', 'uuid-2', 'uuid-3']);
    });

    it('should handle duplicate UUIDs', () => {
      const entities: Entity[] = [
        createMockDataset('uuid-1'),
        createMockDataset('uuid-1'), // duplicate
        createMockDonor('uuid-2'),
      ];

      const uuids = entities.map((e) => e.uuid);

      expect(uuids).toEqual(['uuid-1', 'uuid-1', 'uuid-2']);
      expect(uuids.length).toBe(3);
    });
  });
});
