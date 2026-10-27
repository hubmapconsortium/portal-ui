import { useMemo } from 'react';
import { ESEntityType } from 'js/components/types';
import { useSearchStore } from 'js/components/search/store';
import { buildQuery } from 'js/components/search/utils';
import useEsMapping, { isESMapping } from 'js/components/search/useEsMapping';
import { useMetadataMenu } from './hooks';
import { isEmpty, isObject, isPrimitive } from 'js/helpers/type-guards';

// Map plural lowercase entity types to singular capitalized ones, if applicable
const entityTypeMap: Record<string, ESEntityType | undefined> = {
  donors: 'Donor',
  samples: 'Sample',
  datasets: 'Dataset',
  entities: undefined,
};

/**
 * The query the search page lists its results from — free text, default and revision filters, and
 * the active facet filters — as a single clause, so a download or LineUp view covers exactly the
 * results the user sees.
 */
export function useSearchResultsQuery() {
  const {
    filters,
    facets,
    search,
    searchFields,
    sortField,
    defaultQuery,
    defaultQueryWithAncestorFilter,
    latestRevisionFilter,
    includeSupersededEntities,
  } = useSearchStore();
  const mappings = useEsMapping();

  return useMemo(() => {
    if (!isESMapping(mappings)) {
      return undefined;
    }

    // Filters go in unfiltered: buildQuery skips empty ones itself, and an inverted `exists` facet
    // applies its clause precisely when it has no value selected.
    const builtQuery = buildQuery({
      filters,
      facets,
      search,
      size: 0,
      searchFields,
      sourceFields: {},
      sortField,
      defaultQuery,
      defaultQueryWithAncestorFilter,
      latestRevisionFilter,
      includeSupersededEntities,
      mappings,
      buildAggregations: false,
    }) as { query?: Record<string, unknown>; post_filter?: Record<string, unknown> } | null;

    // The results table applies `query` and `post_filter` together, so both must hold here too.
    const clauses = [builtQuery?.query, builtQuery?.post_filter].filter((clause) => clause !== undefined);
    return clauses.length > 0 ? { bool: { must: clauses } } : undefined;
  }, [
    filters,
    facets,
    search,
    searchFields,
    sortField,
    defaultQuery,
    defaultQueryWithAncestorFilter,
    latestRevisionFilter,
    includeSupersededEntities,
    mappings,
  ]);
}

/**
 * Shared logic for determining query parameters for both LineupMenuItem and DownloadTSVItem.
 * Returns the entity type and query parameters (either UUIDs or filters) for fetching entities.
 */
export function useSharedEntityLogic(lcPluralType: string) {
  const { selectedHits } = useMetadataMenu();
  const filtersQuery = useSearchResultsQuery();

  const entityType = entityTypeMap[lcPluralType];

  // Determine query parameters: use UUIDs if available, otherwise use filters
  const queryParams = useMemo(() => {
    const uuids = selectedHits.size > 0 ? Array.from(selectedHits) : undefined;

    return uuids ? { uuids, entityType } : { entityType, filters: filtersQuery };
  }, [selectedHits, entityType, filtersQuery]);

  return queryParams;
}

// First fields that should appear at the beginning of the TSV
const firstFields = ['uuid', 'hubmap_id'];

const formatDateForFilename = (date: Date) => date.toISOString().slice(0, 19).replace(/:/g, '-');

/**
 * Convert flattened entities to the format expected by useDownloadTable.
 * Mimics the backend _dicts_to_tsv function behavior.
 */
export function entitiesToTableData(
  entities: Record<string, unknown>[],
  allKeys: string[],
  withDescriptions: boolean = true,
  metadataFieldDescriptions: Record<string, string> = {},
  entityType: string = 'entities',
) {
  const fileName = `hubmap-${entityType}-metadata-${formatDateForFilename(new Date())}.tsv`;
  if (entities.length === 0) {
    return {
      columnNames: [],
      rows: [],
      fileName,
      isReady: false,
    };
  }

  const allFields = new Set(allKeys);

  // Remove first fields from the set, then sort the rest
  const bodyFields = Array.from(allFields)
    .filter((field) => !firstFields.includes(field))
    .sort();
  const columnNames = [...firstFields.filter((field) => allFields.has(field)), ...bodyFields];

  // Fill missing values with 'N/A' for each entity
  const normalizedEntities = entities.map((entity) => {
    const normalized: Record<string, string> = {};
    columnNames.forEach((field) => {
      const value = entity[field];
      switch (true) {
        case isEmpty(value):
          normalized[field] = 'N/A';
          break;
        case Array.isArray(value):
          // For arrays, join with commas
          normalized[field] = value.join(', ');
          break;
        case isObject(value):
          // For objects, stringify
          normalized[field] = JSON.stringify(value);
          break;
        case isPrimitive(value):
          // For primitives, convert to string safely
          normalized[field] = String(value);
          break;
        default:
          // Fallback for unknown types
          normalized[field] = 'N/A';
      }
    });
    return normalized;
  });

  // Create rows array
  const rows: string[][] = [];

  // Add descriptions row if requested
  if (withDescriptions) {
    const descriptionsRow = columnNames.map((field) => metadataFieldDescriptions[field] || '');
    rows.push(descriptionsRow);
  }

  // Add data rows
  normalizedEntities.forEach((entity) => {
    const row = columnNames.map((field) => entity[field]);
    rows.push(row);
  });

  return {
    columnNames,
    rows,
    fileName,
    isReady: true,
  };
}
