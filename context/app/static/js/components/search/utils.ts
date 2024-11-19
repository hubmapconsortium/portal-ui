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
import { getPortalESField } from './buildTypesMap';

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

function buildSortField({ sortField }: { sortField: SortField }) {
  const primarySort = esb.sort(getPortalESField(sortField.field), sortField.direction);
  const secondarySortField = sortField?.secondarySort;

  const secondarySort = secondarySortField
    ? [esb.sort(getPortalESField(secondarySortField.field), secondarySortField.direction)]
    : [];

  return [primarySort, ...secondarySort];
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
  buildAggregations = true,
}: { buildAggregations?: boolean } & Pick<
  SearchStoreState,
  'filters' | 'facets' | 'search' | 'size' | 'searchFields' | 'sourceFields' | 'sortField' | 'defaultQuery'
>) {
  const query = esb
    .requestBodySearch()
    .size(size)
    .source([...new Set(Object.values(sourceFields).flat())])
    .sorts(buildSortField({ sortField }));

  const hasTextQuery = search.length > 0;

  const freeTextQueries = hasTextQuery ? [esb.simpleQueryStringQuery(search).fields(searchFields)] : [];
  const defaultQueries = defaultQuery ? [defaultQuery] : [];

  query.query(esb.boolQuery().must([...defaultQueries, ...freeTextQueries]));

  if (hasTextQuery) {
    query.highlight(esb.highlight(searchFields));
  }

  const allFilters = Object.entries(filters).reduce<FilterClauses>((acc, [field, filter]) => {
    return produce(acc, (draft) => {
      const portalField = getPortalESField(field);
      const facetConfig = facets[field];

      if (isTermFilter(filter)) {
        if (filterHasValues({ filter, facet: facetConfig })) {
          draft[portalField] = esb.termsQuery(portalField, [...filter.values]);
        }
      }

      if (isRangeFilter(filter) || isDateFilter(filter)) {
        if (filterHasValues({ filter, facet: facetConfig })) {
          if (filter.values.min && filter.values.max) {
            // TODO: consider using zod in filterHasValues for validation.
            draft[portalField] = esb.rangeQuery(portalField).gte(filter.values.min).lte(filter.values.max);
          }
        }
      }

      if (isHierarchicalFilter(filter) && isHierarchicalFacet(facetConfig)) {
        if (filterHasValues({ filter, facet: facetConfig })) {
          const childPortalField = getPortalESField(facetConfig.childField);

          draft[portalField] = esb.termsQuery(portalField, Object.keys(filter.values));

          const childValues = Object.values(filter.values)
            .map((v) => [...v])
            .flat();
          draft[childPortalField] = esb.termsQuery(childPortalField, childValues);
        }
      }

      if (isExistsFilter(filter) && isExistsFacet(facetConfig)) {
        if (!(filterHasValues({ filter, facet: facetConfig }) && facetConfig?.invert)) {
          draft[portalField] = esb.existsQuery(field);
        }
      }
    });
  }, {});

  query.postFilter(esb.boolQuery().must(Object.values(allFilters)));

  if (buildAggregations) {
    Object.values(facets).forEach((facet) => {
      const { field } = facet;
      const portalField = getPortalESField(field);

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
        const parentPortalField = getPortalESField(field);
        const childPortalField = getPortalESField(childField);

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
