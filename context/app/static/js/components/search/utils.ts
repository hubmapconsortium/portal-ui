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
} from './store';
import { getPortalESField } from './buildTypesMap';

const maxAggSize = 10000;

type FilterClauses = Record<string, esb.Query>;

function buildFilterAggregation({
  field,
  portalFields,
  aggregation,
  filters,
}: {
  field: string;
  portalFields: string[];
  aggregation: esb.Aggregation;
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

  return esb.filterAggregation(field, otherFiltersQuery).agg(aggregation);
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
}: Omit<SearchStoreState, 'swrConfig' | 'view' | 'type' | 'analyticsCategory' | 'endpoint'>) {
  const query = esb
    .requestBodySearch()
    .size(size)
    .source([...new Set(Object.values(sourceFields).flat())])
    .sort(esb.sort(getPortalESField(sortField.field), sortField.direction));

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

      if (isRangeFilter(filter)) {
        if (filterHasValues({ filter, facet: facetConfig })) {
          draft[portalField] = esb.rangeQuery(portalField).gte(filter.values.min).lte(filter.values.max);
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
    });
  }, {});

  query.postFilter(esb.boolQuery().must(Object.values(allFilters)));

  Object.values(facets).forEach((facet) => {
    const { field } = facet;
    const portalField = getPortalESField(field);

    if (isTermFacet(facet)) {
      const { size: facetSize, order } = facet;
      query.agg(
        buildFilterAggregation({
          portalFields: [portalField],
          aggregation: esb
            .termsAggregation(field, portalField)
            .size(facetSize ?? maxAggSize)
            .order(order?.type ?? '_count', order?.dir ?? 'desc'),
          filters: { ...allFilters },
          field,
        }),
      );
    }

    if (isRangeFacet(facet)) {
      const { min, max } = facet;
      const interval = Math.ceil((max - min) / 20);

      query.agg(
        buildFilterAggregation({
          portalFields: [portalField],
          aggregation: esb.histogramAggregation(field, portalField, interval).extendedBounds(min, max),
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
          aggregation: esb
            .termsAggregation(field, parentPortalField)
            .size(maxAggSize)
            .order(order?.type ?? '_count', order?.dir ?? 'desc')
            .agg(
              esb
                .termsAggregation(childField, childPortalField)
                .size(maxAggSize)
                .order(order?.type ?? '_count', order?.dir ?? 'desc'),
            ),
          filters: { ...allFilters },
          field,
        }),
      );
    }
  });

  return query.toJSON();
}
