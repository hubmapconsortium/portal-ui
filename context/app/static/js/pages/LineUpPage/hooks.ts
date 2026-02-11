import { SearchHit, SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import { Donor, Entity, ESEntityType } from 'js/components/types';
import { useAllSearchHits } from 'js/hooks/useSearchData';
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
    if (!obj) {
      continue;
    }
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
    hubmap_id: source.hubmap_id,
    'donor.hubmap_id': (donor as Donor)?.hubmap_id || '',
    ...Object.fromEntries(
      [...keys].map(
        (key) =>
          [
            key,
            getValueFromObjects([source, metadata, mapped_metadata, organ_donor_data, living_donor_data], key) ?? '',
          ] as const,
      ),
    ),
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
  'donor',
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

export interface UseLineupPageEntitiesProps<EntityType extends ESEntityType = ESEntityType> {
  uuids?: string[];
  entityType?: EntityType;
  selectedKeys?: string[];
  filters?: Record<string, unknown>;
  shouldFetchData?: boolean;
}

interface UseLineupPageEntitiesReturnType {
  entities: Record<string, unknown>[];
  isLoading: boolean;
  allKeys: string[];
  totalHitsCount?: number;
}

/**
 * Fetches and flattens entities for the LineUp page based on provided UUIDs and/or entity type.
 * @param uuids Optional array of UUIDs to filter entities
 * @param entityType Optional entity type to filter entities
 * @param filters Optional filters from SearchStore to apply when no UUIDs are specified
 * @returns The fetched and flattened entities
 */
export function useLineupEntities<EntityType extends ESEntityType>({
  uuids,
  entityType,
  selectedKeys,
  filters,
  shouldFetchData = true,
}: UseLineupPageEntitiesProps<EntityType>): UseLineupPageEntitiesReturnType {
  const query: SearchRequest['query'] = useMemo<SearchRequest['query']>(() => {
    if (!uuids && !entityType && !filters) {
      return {};
    }

    const conditions: Array<Record<string, unknown>> = [];

    // If UUIDs are provided, prioritize them and ignore filters
    if (uuids) {
      conditions.push({ ids: { values: uuids } });
    } else if (filters) {
      // Apply filters only when no specific UUIDs are provided
      conditions.push(filters);
    }

    // Always apply entity type filter if provided
    if (entityType) {
      conditions.push({ term: { entity_type: entityType.toLowerCase() } });
    }

    if (conditions.length === 0) {
      return {};
    }

    return {
      bool: {
        must: conditions,
      },
    };
  }, [entityType, uuids, filters]);

  const { searchHits, ...rest } = useAllSearchHits<Entity>(
    {
      query,
      _source,
    },
    {
      shouldFetch: shouldFetchData,
    },
  );

  // Extract all keys from the fetched entities for use in LineUp columns
  const allKeys = useMemo(() => Array.from(getAllKeys(searchHits)).sort(), [searchHits]);

  // selectedKeys must be provided and non-empty to show any columns in the lineup.
  const entities = useMemo(() => {
    const keysToUse =
      !selectedKeys || selectedKeys.length === 0 ? allKeys : selectedKeys.filter((key) => allKeys.includes(key));
    return searchHits.map((hit) => filterNestedFields(flattenEntity(hit, keysToUse)));
  }, [searchHits, allKeys, selectedKeys]);

  return { entities, allKeys, ...rest };
}
