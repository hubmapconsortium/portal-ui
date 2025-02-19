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
  mappings,
  buildAggregations = true,
}: { buildAggregations?: boolean; mappings: UseESMappingType } & Pick<
  SearchStoreState,
  'filters' | 'facets' | 'search' | 'size' | 'searchFields' | 'sourceFields' | 'sortField' | 'defaultQuery'
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

  const freeTextQueries = hasTextQuery ? [esb.simpleQueryStringQuery(search).fields(searchFields)] : [];
  const defaultQueries = defaultQuery ? [defaultQuery] : [];

  query.query(esb.boolQuery().must([...defaultQueries, ...freeTextQueries]));

  if (hasTextQuery) {
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
          draft[childPortalField] = esb.termsQuery(childPortalField, childValues);
        }
      }

      if (isExistsFilter(filter) && isExistsFacet(facetConfig)) {
        if (!(filterHasValues({ filter }) && facetConfig?.invert)) {
          draft[portalField] = esb.existsQuery(field);
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
    });
  }

  return query.toJSON();
}
