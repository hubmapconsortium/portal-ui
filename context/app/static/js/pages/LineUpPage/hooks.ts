import { SearchHit, SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import { Dataset, Donor, Entity, ESEntityType, Sample, isDataset, isDonor, isSample } from 'js/components/types';
import { useSearchHits } from 'js/hooks/useSearchData';
import { useMemo } from 'react';

interface UseLineupPageEntitiesProps<EntityType extends ESEntityType = ESEntityType> {
  uuids?: string[];
  entityType?: EntityType;
}

interface UseLineupPageEntitiesReturnType {
  searchHits: Record<string, unknown>[];
  isLoading: boolean;
}

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
 * Helper method for flattening entities without specific nested fields, e.g. Publications, Collections, Supports.
 * @param entity The entity to flatten
 * @param keys The metadata keys to extract
 * @returns The flattened entity
 */
const flattenGenericEntity = (entity: Entity, keys: string[]) => {
  const { metadata = {}, mapped_metadata = {}, ...source } = entity;
  return {
    ...source,
    ...Object.fromEntries(
      [...keys].map((key) => [key, getValueFromObjects([metadata ?? {}, mapped_metadata ?? {}], key) ?? '']),
    ),
  };
};

const flattenDataset = (entity: Dataset, keys: string[]) => {
  // Currently no additional dataset-specific nested fields to flatten
  return flattenGenericEntity(entity, keys);
};

/**
 * Helper method for flattening donor entities with nested donor-specific values.
 * @param entity The donor entity to flatten
 * @param keys The keys to extract
 * @returns The flattened donor entity
 */
const flattenDonor = (entity: Donor, keys: string[]) => {
  const { metadata = {}, mapped_metadata = {}, organ_donor_data = {}, living_donor_data = {}, ...source } = entity;
  return {
    ...source,
    ...Object.fromEntries(
      [...keys].map(
        (key) =>
          [
            key,
            getValueFromObjects([metadata, mapped_metadata, organ_donor_data, living_donor_data], key) ?? '',
          ] as const,
      ),
    ),
  };
};

/**
 * Helper method for flattening sample entities with nested sample-specific values.
 * @param entity The sample entity to flatten
 * @param keys The keys to extract
 * @returns The flattened sample entity
 */
const flattenSample = (entity: Sample, keys: string[]) => {
  const { metadata = {}, mapped_metadata = {}, organ_donor_data = {}, ...source } = entity;
  return {
    ...source,
    ...Object.fromEntries(
      [...keys].map(
        (key) => [key, getValueFromObjects([metadata, mapped_metadata, organ_donor_data], key) ?? ''] as const,
      ),
    ),
  };
};

/**
 * Helper method to flatten an entity based on its type.
 * @param entity The entity to flatten
 * @param keys The keys to extract from the entity
 * @returns The flattened entity
 */
const flattenEntity = (entity: Required<SearchHit<Entity>>, keys: string[]) => {
  const data = entity._source;
  if (isDataset(data)) {
    return flattenDataset(data, keys);
  }
  if (isDonor(data)) {
    return flattenDonor(data, keys);
  }
  if (isSample(data)) {
    return flattenSample(data, keys);
  }
  return flattenGenericEntity(data, keys);
};

const nestedFields = ['metadata', 'mapped_metadata', 'organ_donor_data', 'extra_metadata', 'living_donor_data'];

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

/**
 * Fetches and flattens entities for the LineUp page based on provided UUIDs and/or entity type.
 * @param uuids Optional array of UUIDs to filter entities
 * @param entityType Optional entity type to filter entities
 * @returns The fetched and flattened entities
 */
export function useLineupPageEntities<EntityType extends ESEntityType>({
  uuids,
  entityType,
}: UseLineupPageEntitiesProps<EntityType>): UseLineupPageEntitiesReturnType {
  const query: SearchRequest['query'] = useMemo(() => {
    if (!uuids && !entityType) {
      return {};
    }
    const uuidsFilter = uuids ? { terms: { uuid: uuids } } : undefined;
    const entityTypeFilter = entityType ? { term: { entity_type: entityType } } : undefined;
    const filter = [uuidsFilter, entityTypeFilter].filter(Boolean);
    return {
      bool: {
        filter,
      },
    } as SearchRequest['query'];
  }, [entityType, uuids]);

  const _source = useMemo(() => {
    const universalFields = [
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
      ...nestedFields,
    ];
    if (entityType === 'Sample') {
      return [...universalFields, 'donor.hubmap_id', 'origin_samples_unique_mapped_organs', 'sample_category'];
    }
    if (entityType === 'Dataset') {
      return [...universalFields, 'donor.hubmap_id', 'origin_samples_unique_mapped_organs'];
    }
    return universalFields;
  }, [entityType]);

  const { searchHits, ...rest } = useSearchHits<Entity>({
    size: 10_000,
    query,
    _source,
  });

  // Flatten metadata fields into top-level fields and fill them with empty strings if not present
  // This allows LineUp to treat all rows uniformly
  const flattenedHits = useMemo(() => {
    const allMetadataKeys = new Set<string>();
    searchHits.forEach((hit) => {
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
    });
    const flattened = searchHits.map((hit) =>
      filterNestedFields(flattenEntity(hit, Array.from(allMetadataKeys).sort())),
    );
    return flattened;
  }, [searchHits]);

  return { searchHits: flattenedHits, ...rest };
}
