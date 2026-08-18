import esb from 'elastic-builder';
import { produce } from 'immer';

import {
  SearchStoreState,
  filterHasValues,
  isTermFilter,
  isRangeFilter,
  isHierarchicalFilter,
  isHierarchicalFacet,
  isTermFacet,
  isRangeFacet,
  SortField,
  isDateFilter,
  isDateFacet,
  isExistsFilter,
  isExistsFacet,
  isBooleanGroupFilter,
  isBooleanGroupFacet,
  getBooleanGroupItemKey,
} from './store';
import { getESField, isESMapping, Mappings, UseESMappingType } from './useEsMapping';

const maxAggSize = 10000;

type FilterClauses = Record<string, esb.Query>;

// Canonical HuBMAP ID format, e.g. "HBM123.ABCD.456" — three dot-separated parts,
// with exactly 3 digits in each numeric segment.
const HBM_ID_FORMAT_REGEX = /^HBM\d{3}\.[A-Z0-9]+\.\d{3}$/i;

// HuBMAP UUIDs are exactly 32 hex characters with no dashes.
const UUID_FORMAT_REGEX = /^[a-f0-9]{32}$/i;

export function isHbmIdFormat(value: string): boolean {
  return HBM_ID_FORMAT_REGEX.test(value);
}

export function isUuidFormat(value: string): boolean {
  return UUID_FORMAT_REGEX.test(value);
}

function buildFilterAggregation({
  field,
  portalFields,
  aggregations,
  filters,
}: {
  field: string;
  portalFields: string[];
  aggregations: esb.Aggregation[];
  filters: FilterClauses;
}) {
  portalFields.forEach((f) => {
    if (f in filters) {
      delete filters[f];
    }
  });

  const otherFiltersQuery = Object.keys(filters).length
    ? esb.boolQuery().must(Object.values(filters))
    : esb.boolQuery().must([]);

  return esb.filterAggregation(field, otherFiltersQuery).aggs(aggregations);
}

function buildSortField({
  sortField,
  mappings,
  uniqueSortField,
}: {
  sortField: SortField;
  mappings: Mappings;
  uniqueSortField: string;
}) {
  const primarySort = esb.sort(getESField({ field: sortField.field, mappings }), sortField.direction);
  const secondarySortField = sortField?.secondarySort;

  const secondarySort = secondarySortField
    ? [esb.sort(getESField({ field: secondarySortField.field, mappings }), secondarySortField.direction)]
    : [];

  // Sort values need to be unique for search_after. Indices without a `uuid` field must
  // override this: sorting on a field absent from the mapping is a hard ES error
  // ("No mapping found for [uuid.keyword] in order to sort on"), not a silent no-op.
  const uniqueSort = esb.sort(uniqueSortField, 'desc');

  return [primarySort, ...secondarySort, uniqueSort];
}

/** Groups hits by `field`, returning the grouped documents under `innerHits.name`. */
export interface CollapseConfig {
  field: string;
  innerHits: {
    name: string;
    size: number;
    /** Order within each group. Independent of the outer result sort. */
    sort?: SortField;
  };
}

/**
 * Where active filters are applied.
 *
 * `post_filter` (the default) keeps them out of the main query so aggregations see the
 * unfiltered document set. `query` puts them in the main query instead, which is required
 * when `collapse` is used: `inner_hits` honour the main query but ignore `post_filter`, so
 * with `post_filter` the per-group documents would ignore the active filters. Callers using
 * `query` mode should request aggregations separately (see `useFacetAggregations`), since a
 * single request cannot both filter the hits and leave the aggregations unfiltered.
 */
export type FilterMode = 'post_filter' | 'query';

export const DEFAULT_UNIQUE_SORT_FIELD = 'uuid.keyword';

/**
 * Aggregation holding the number of distinct groups when results are collapsed.
 *
 * `hits.total` counts matching documents, which under `collapse` is not the number of rows,
 * so the group count has to be aggregated separately.
 */
export const GROUP_COUNT_AGG = 'total_groups';

// `cardinality` is approximate above its precision threshold. 40000 is the maximum ES honours
// and is comfortably above the number of datasets, so the count comes back exact.
const groupCountPrecisionThreshold = 40000;

export function buildQuery({
  filters,
  facets,
  search,
  size,
  searchFields,
  sourceFields,
  sortField,
  defaultQuery,
  defaultQueryWithAncestorFilter,
  latestRevisionFilter,
  includeSupersededEntities,
  mappings,
  buildAggregations = true,
  uniqueSortField = DEFAULT_UNIQUE_SORT_FIELD,
  filterMode = 'post_filter',
  collapse,
  groupCountField,
  hubmapIdField = 'hubmap_id',
  uuidField = 'uuid',
}: {
  buildAggregations?: boolean;
  mappings: UseESMappingType;
  uniqueSortField?: string;
  filterMode?: FilterMode;
  collapse?: CollapseConfig;
  /** Emit a `GROUP_COUNT_AGG` counting distinct values of this field. */
  groupCountField?: string;
  /**
   * Fields an ID-shaped search term is matched against. Indices that name them differently
   * must override: an unmapped field in a query matches nothing *silently*, so a pasted ID
   * would simply return no results.
   */
  hubmapIdField?: string;
  uuidField?: string;
} & Pick<
  SearchStoreState,
  | 'filters'
  | 'facets'
  | 'search'
  | 'size'
  | 'searchFields'
  | 'sourceFields'
  | 'sortField'
  | 'defaultQuery'
  | 'defaultQueryWithAncestorFilter'
  | 'latestRevisionFilter'
  | 'includeSupersededEntities'
>) {
  if (!isESMapping(mappings)) {
    return null;
  }
  const query = esb
    .requestBodySearch()
    .size(size)
    .source([...new Set(Object.values(sourceFields).flat())])
    .sorts(buildSortField({ sortField, mappings, uniqueSortField }));

  const hasTextQuery = search.length > 0;

  // Entity-id lookups bypass the "latest revision only" filter so superseded entities
  // can still be found by ID. Detection covers:
  //   - wildcard form `*...*` (column-header HuBMAP ID popover)
  //   - canonical HuBMAP ID format `HBM###.XXXX.###`
  //   - 32-hex-char UUIDs
  //   - legacy quoted-HBM form `"HBM..."` (preserved for backward compat with old URLs)
  const isWildcardIdSearch = hasTextQuery && /^\*.*\*$/.test(search);
  const isHbmIdFormatSearch = hasTextQuery && isHbmIdFormat(search);
  const isUuidFormatSearch = hasTextQuery && isUuidFormat(search);
  const isQuotedHbmIdSearch = hasTextQuery && /^"\s*HBM\S+\s*"$/i.test(search);
  const isIdLookupSearch = isWildcardIdSearch || isHbmIdFormatSearch || isUuidFormatSearch || isQuotedHbmIdSearch;

  // ES keyword fields are case-sensitive; HuBMAP IDs are stored uppercase and UUIDs
  // lowercase, so normalize the search term to the canonical case before exact match.
  const freeTextQueries = hasTextQuery
    ? isWildcardIdSearch
      ? [esb.wildcardQuery(getESField({ field: hubmapIdField, mappings }), search)]
      : isHbmIdFormatSearch
        ? [esb.termQuery(getESField({ field: hubmapIdField, mappings }), search.toUpperCase())]
        : isUuidFormatSearch
          ? [esb.termQuery(getESField({ field: uuidField, mappings }), search.toLowerCase())]
          : [esb.simpleQueryStringQuery(search).fields(searchFields)]
    : [];
  const ancestorIdsFilter = filters?.ancestor_ids;
  const hasAncestorIdsFilter = Boolean(ancestorIdsFilter && filterHasValues({ filter: ancestorIdsFilter }));
  const effectiveDefaultQuery =
    hasAncestorIdsFilter && defaultQueryWithAncestorFilter ? defaultQueryWithAncestorFilter : defaultQuery;
  const defaultQueries = effectiveDefaultQuery ? [effectiveDefaultQuery] : [];
  const revisionFilterQueries =
    latestRevisionFilter && !isIdLookupSearch && !includeSupersededEntities ? [latestRevisionFilter] : [];

  query.query(esb.boolQuery().must([...defaultQueries, ...revisionFilterQueries, ...freeTextQueries]));

  // Highlight only for free-text queries; exact-match ID lookups don't need highlighting.
  if (hasTextQuery && !isWildcardIdSearch && !isHbmIdFormatSearch && !isUuidFormatSearch) {
    query.highlight(esb.highlight(searchFields));
  }

  const allFilters = Object.entries(filters).reduce<FilterClauses>((acc, [field, filter]) => {
    return produce(acc, (draft) => {
      const portalField = getESField({ field, mappings });
      const facetConfig = facets[field];

      if (isTermFilter(filter)) {
        if (filterHasValues({ filter })) {
          draft[portalField] = esb.termsQuery(portalField, [...filter.values]);
        }
      }

      if (isRangeFilter(filter) || isDateFilter(filter)) {
        if (filterHasValues({ filter })) {
          if (filter?.values?.min !== undefined && filter?.values?.max) {
            // TODO: consider using zod in filterHasValues for validation.
            // Overlap, not point-membership. As two separate range clauses, *different*
            // array elements can satisfy each bound, so a multi-donor field like
            // donor_demographics.age_value=[1.42, 78] matches a 20-60 query (span overlaps).
            // A single combined gte/lte range needs one element inside [min,max] and would
            // miss it. For scalar fields (dates, single value) this is equivalent.
            draft[portalField] = esb
              .boolQuery()
              .must([
                esb.rangeQuery(portalField).gte(filter.values.min),
                esb.rangeQuery(portalField).lte(filter.values.max),
              ]);
          }
        }
      }

      if (isHierarchicalFilter(filter) && isHierarchicalFacet(facetConfig)) {
        if (filterHasValues({ filter })) {
          const childPortalField = getESField({ field: facetConfig.childField, mappings });

          draft[portalField] = esb.termsQuery(portalField, Object.keys(filter.values));

          const childValues = Object.values(filter.values)
            .map((v) => [...v])
            .flat();
          if (childValues.length) {
            draft[childPortalField] = esb.termsQuery(childPortalField, childValues);
          }
        }
      }

      if (isExistsFilter(filter) && isExistsFacet(facetConfig)) {
        const hasValues = filterHasValues({ filter });
        // handle new non-inverted facet use case
        if (!facetConfig?.invert && hasValues) {
          draft[portalField] = esb.existsQuery(field);
        }
        // preserve original logic for inverted facets
        else if (facetConfig?.invert) {
          if (!(hasValues && facetConfig?.invert)) {
            draft[portalField] = esb.existsQuery(field);
          }
        }
      }

      if (isBooleanGroupFilter(filter) && isBooleanGroupFacet(facetConfig)) {
        if (filterHasValues({ filter })) {
          const mustQueries: esb.Query[] = [];
          for (const itemKey of filter.values) {
            const item = facetConfig.items.find((i) => getBooleanGroupItemKey(i) === itemKey);
            if (!item) continue;
            const itemPortalField = getESField({ field: item.field, mappings });
            if (item.queryType === 'exists') {
              mustQueries.push(esb.existsQuery(item.field));
            } else {
              mustQueries.push(esb.termQuery(itemPortalField, item.value));
            }
          }
          if (mustQueries.length === 1) {
            draft[field] = mustQueries[0];
          } else if (mustQueries.length > 1) {
            draft[field] = esb.boolQuery().must(mustQueries);
          }
        }
      }
    });
  }, {});

  if (filterMode === 'query') {
    // Filters belong to the main query so that `inner_hits` (which ignore `post_filter`)
    // reflect them. Aggregations for this mode are fetched by a separate request.
    // This replaces the bool query set above, re-listing its clauses plus the filters.
    query.query(
      esb
        .boolQuery()
        .must([...defaultQueries, ...revisionFilterQueries, ...freeTextQueries, ...Object.values(allFilters)]),
    );
  } else {
    query.postFilter(esb.boolQuery().must(Object.values(allFilters)));
  }

  if (collapse) {
    const innerHits = esb.innerHits(collapse.innerHits.name).size(collapse.innerHits.size);
    const innerSort = collapse.innerHits.sort;
    if (innerSort) {
      innerHits.sort(esb.sort(getESField({ field: innerSort.field, mappings }), innerSort.direction));
    }
    // Bounds how many group-expansion queries ES runs at once.
    query.collapse(getESField({ field: collapse.field, mappings }), innerHits, 4);
  }

  if (buildAggregations && groupCountField) {
    // Unlike the facet aggregations, this one applies every active filter: it reports how
    // many rows the current query yields, so nothing may be excluded from it.
    query.agg(
      esb
        .filterAggregation(GROUP_COUNT_AGG, esb.boolQuery().must(Object.values(allFilters)))
        .agg(
          esb
            .cardinalityAggregation(GROUP_COUNT_AGG, getESField({ field: groupCountField, mappings }))
            .precisionThreshold(groupCountPrecisionThreshold),
        ),
    );
  }

  if (buildAggregations) {
    Object.values(facets).forEach((facet) => {
      const { field } = facet;
      const portalField = getESField({ field, mappings });

      if (isTermFacet(facet)) {
        const { order } = facet;
        query.agg(
          buildFilterAggregation({
            portalFields: [portalField],
            aggregations: [
              esb
                .termsAggregation(field, portalField)
                .size(maxAggSize)
                .order(order?.type ?? '_count', order?.dir ?? 'desc'),
            ],
            filters: { ...allFilters },
            field,
          }),
        );
      }

      if (isRangeFacet(facet)) {
        const { interval } = facet;

        query.agg(
          buildFilterAggregation({
            portalFields: [portalField],
            aggregations: [esb.histogramAggregation(field, portalField, interval ?? 5).extendedBounds(0, 0)],
            filters: { ...allFilters },
            field,
          }),
        );
      }

      if (isDateFacet(facet)) {
        query.agg(
          buildFilterAggregation({
            portalFields: [portalField],
            aggregations: [
              esb.maxAggregation(`${field}_max`, portalField),
              esb.minAggregation(`${field}_min`, portalField),
            ],
            filters: { ...allFilters },
            field,
          }),
        );
      }

      if (isHierarchicalFacet(facet)) {
        const { childField, order } = facet;
        if (!childField) {
          return;
        }
        const parentPortalField = getESField({ field, mappings });
        const childPortalField = getESField({ field: childField, mappings });

        query.agg(
          buildFilterAggregation({
            portalFields: [parentPortalField, childPortalField],
            aggregations: [
              esb
                .termsAggregation(field, parentPortalField)
                .size(maxAggSize)
                .order(order?.type ?? '_count', order?.dir ?? 'desc')
                .agg(
                  esb
                    .termsAggregation(childField, childPortalField)
                    .size(maxAggSize)
                    .order(order?.type ?? '_count', order?.dir ?? 'desc'),
                ),
            ],
            filters: { ...allFilters },
            field,
          }),
        );
      }

      if (isBooleanGroupFacet(facet)) {
        const itemAggregations = facet.items.map((item) => {
          const itemKey = getBooleanGroupItemKey(item);
          const itemPortalField = getESField({ field: item.field, mappings });
          if (item.queryType === 'exists') {
            return esb.filterAggregation(itemKey, esb.existsQuery(item.field));
          }
          return esb.filterAggregation(itemKey, esb.termQuery(itemPortalField, item.value));
        });

        query.agg(
          buildFilterAggregation({
            portalFields: [field],
            aggregations: itemAggregations,
            filters: { ...allFilters },
            field,
          }),
        );
      }
    });
  }

  return query.toJSON();
}

export interface SearchTypeProps {
  type: 'Dataset' | 'Donor' | 'Sample' | 'File' | 'Dev Search';
}

export function isDevSearch(type: string): type is 'Dev Search' {
  return type === 'Dev Search';
}

/**
 * Files are not HuBMAP entities: they have no detail page, cannot be saved to lists,
 * added to workspaces or visualized, so the entity-only result actions are hidden for them.
 */
export function isFileSearch(type: string): type is 'File' {
  return type === 'File';
}
