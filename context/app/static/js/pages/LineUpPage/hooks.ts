import { SearchHit, SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import { Donor, Entity, ESEntityType } from 'js/components/types';
import { useSearchHits } from 'js/hooks/useSearchData';
import { useMemo } from 'react';

/**
 * Helper method to extract value for a given key from a list of objects.
 *
 * @param objects Array of objects to search through
 * @param key The key to find
 * @returns The value associated with the key, or an empty string if not found
 */
const getValueFromObjects = (objects: Record<string, unknown>[], key: string) => {
  for (const obj of objects) {
    if (key in obj) {
      return obj[key];
    }
  }
  return '';
};

/**
 * Helper method to flatten an entity based on its type.
 * @param entity The entity to flatten
 * @param keys The keys to extract from the entity
 * @returns The flattened entity
 */
const flattenEntity = (entity: Required<SearchHit<Entity>>, keys: string[]) => {
  const data = entity._source;

  const {
    metadata = {},
    mapped_metadata = {},
    organ_donor_data = {},
    living_donor_data = {},
    donor = {},
    ...source
  } = data;
  return {
    'donor.hubmap_id': (donor as Donor)?.hubmap_id || '',
    ...Object.fromEntries(
      [...keys].map(
        (key) =>
          [
            key,
            getValueFromObjects([metadata, mapped_metadata, organ_donor_data, living_donor_data], key) ?? '',
          ] as const,
      ),
    ),
    ...source,
  };
};

const nestedFields = [
  'metadata',
  'mapped_metadata',
  'organ_donor_data',
  'extra_metadata',
  'living_donor_data',
  'donor',
];

const _source = [
  'uuid',
  'hubmap_id',
  'published_timestamp',
  'last_modified_timestamp',
  'created_timestamp',
  'status',
  'mapped_status',
  'data_access_level',
  'mapped_consortium',
  'group_name',
  'created_by_user_displayname',
  'created_by_user_email',
  'origin_samples_unique_mapped_organs',
  'sample_category',
  'donor.hubmap_id',
  ...nestedFields,
];

/**
 * Helper method to filter out nested fields from the entity so they don't create empty columns in LineUp.
 * @param entity The entity to filter
 * @returns The filtered entity
 */
const filterNestedFields = (entity: Record<string, unknown>) => {
  const filteredEntity = { ...entity };
  for (const field of nestedFields) {
    delete filteredEntity[field];
  }
  return filteredEntity;
};

const getAllKeys = (entities: SearchHit<Entity>[]) => {
  return entities.reduce<Set<string>>((allMetadataKeys, hit) => {
    Object.keys(hit._source || {}).forEach((key) => allMetadataKeys.add(key));
    if (hit._source?.metadata) {
      Object.keys(hit._source.metadata).forEach((key) => allMetadataKeys.add(key));
    }
    if (hit._source?.mapped_metadata) {
      Object.keys(hit._source.mapped_metadata).forEach((key) => allMetadataKeys.add(key));
    }
    if (hit._source?.organ_donor_data) {
      Object.keys(hit._source.organ_donor_data).forEach((key) => allMetadataKeys.add(key));
    }
    if (hit._source?.extra_metadata) {
      Object.keys(hit._source.extra_metadata).forEach((key) => allMetadataKeys.add(key));
    }
    if (hit._source?.living_donor_data) {
      Object.keys(hit._source.living_donor_data).forEach((key) => allMetadataKeys.add(key));
    }
    // Remove nested fields
    nestedFields.forEach((field) => allMetadataKeys.delete(field));
    // Add special case for donor.hubmap_id
    allMetadataKeys.add('donor.hubmap_id');
    return allMetadataKeys;
  }, new Set<string>());
};

interface UseLineupPageEntitiesProps<EntityType extends ESEntityType = ESEntityType> {
  uuids?: string[];
  entityType?: EntityType;
}

interface UseLineupPageEntitiesReturnType {
  entities: Record<string, unknown>[];
  isLoading: boolean;
  allKeys: string[];
}

/**
 * Fetches and flattens entities for the LineUp page based on provided UUIDs and/or entity type.
 * @param uuids Optional array of UUIDs to filter entities
 * @param entityType Optional entity type to filter entities
 * @returns The fetched and flattened entities
 */
export function useLineupEntities<EntityType extends ESEntityType>({
  uuids,
  entityType,
}: UseLineupPageEntitiesProps<EntityType>): UseLineupPageEntitiesReturnType {
  const query: SearchRequest['query'] = useMemo(() => {
    if (!uuids && !entityType) {
      return {};
    }
    const uuidsFilter = uuids ? { ids: { values: uuids } } : undefined;
    const entityTypeFilter = entityType ? { term: { entity_type: entityType.toLowerCase() } } : undefined;
    return {
      bool: {
        must: [...(uuidsFilter ? [uuidsFilter] : []), ...(entityTypeFilter ? [entityTypeFilter] : [])],
      },
    } as SearchRequest['query'];
  }, [entityType, uuids]);

  const { searchHits, ...rest } = useSearchHits<Entity>({
    size: 10_000,
    query,
    _source,
  });

  // Flatten metadata fields into top-level fields and fill them with empty strings if not present
  // This allows LineUp to treat all rows uniformly
  const [entities, allKeys] = useMemo(() => {
    const allMetadataKeys = getAllKeys(searchHits);
    const flattened = searchHits.map((hit) =>
      filterNestedFields(flattenEntity(hit, Array.from(allMetadataKeys).sort())),
    );
    return [flattened, Array.from(allMetadataKeys).sort()];
  }, [searchHits]);

  return { entities, allKeys, ...rest };
}
