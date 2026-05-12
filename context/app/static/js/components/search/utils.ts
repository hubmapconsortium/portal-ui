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

function buildSortField({ sortField, mappings }: { sortField: SortField; mappings: Mappings }) {
  const primarySort = esb.sort(getESField({ field: sortField.field, mappings }), sortField.direction);
  const secondarySortField = sortField?.secondarySort;

  const secondarySort = secondarySortField
    ? [esb.sort(getESField({ field: secondarySortField.field, mappings }), secondarySortField.direction)]
    : [];

  // Sort values need to be unique for search_after.
  const uniqueSort = esb.sort('uuid.keyword', 'desc');

  return [primarySort, ...secondarySort, uniqueSort];
}

export function buildQuery({
  filters,
  facets,
  search,
  size,
  searchFields,
  sourceFields,
  sortField,
  defaultQuery,
  latestRevisionFilter,
  includeSupersededEntities,
  mappings,
  buildAggregations = true,
}: { buildAggregations?: boolean; mappings: UseESMappingType } & Pick<
  SearchStoreState,
  | 'filters'
  | 'facets'
  | 'search'
  | 'size'
  | 'searchFields'
  | 'sourceFields'
  | 'sortField'
  | 'defaultQuery'
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
    .sorts(buildSortField({ sortField, mappings }));

  const hasTextQuery = search.length > 0;

  // Column-header HuBMAP ID popover wraps input as *...* (SearchTableHeaderCell.tsx);
  // top search bar quotes exact HBM IDs (SearchBar.tsx). Either form is treated as an
  // entity-id lookup: it bypasses the "latest revision only" filter so superseded
  // entities can still be found by their HuBMAP ID.
  const isWildcardIdSearch = hasTextQuery && /^\*.*\*$/.test(search);
  const isQuotedHbmIdSearch = hasTextQuery && /^"\s*HBM\S+\s*"$/i.test(search);
  const isIdLookupSearch = isWildcardIdSearch || isQuotedHbmIdSearch;

  const freeTextQueries = hasTextQuery
    ? isWildcardIdSearch
      ? [esb.wildcardQuery(getESField({ field: 'hubmap_id', mappings }), search)]
      : [esb.simpleQueryStringQuery(search).fields(searchFields)]
    : [];
  const defaultQueries = defaultQuery ? [defaultQuery] : [];
  const revisionFilterQueries =
    latestRevisionFilter && !isIdLookupSearch && !includeSupersededEntities ? [latestRevisionFilter] : [];

  query.query(esb.boolQuery().must([...defaultQueries, ...revisionFilterQueries, ...freeTextQueries]));

  if (hasTextQuery && !isWildcardIdSearch) {
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
            draft[portalField] = esb.rangeQuery(portalField).gte(filter.values.min).lte(filter.values.max);
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

  query.postFilter(esb.boolQuery().must(Object.values(allFilters)));

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
  type: 'Dataset' | 'Donor' | 'Sample' | 'Dev Search';
}

export function isDevSearch(type: string): type is 'Dev Search' {
  return type === 'Dev Search';
}
