import type { estypes } from '@elastic/elasticsearch';

// ElasticSearch moved all of their type exports to a single
// `estypes` object. This file directly re-exports those types
// to ensure code readability.

export type SearchRequest = estypes.SearchRequest;
export type SearchHit<Doc> = estypes.SearchHit<Doc>;
export type SearchResponse<Doc, Aggs> = estypes.SearchResponse<Doc, Aggs>;
export type AggregationsAggregate = estypes.AggregationsAggregate;
export type SearchResponseBody<Doc, Aggs> = estypes.SearchResponseBody<Doc, Aggs>;
export type Ids = estypes.Ids;
export type QueryDslQueryContainer = estypes.QueryDslQueryContainer;
export type AggregationsAggregationContainer = estypes.AggregationsAggregationContainer;
export type SortResults = estypes.SortResults;
export type AggregationsTermsAggregateBase<Doc> = estypes.AggregationsTermsAggregateBase<Doc>;
export type AggregationsSingleMetricAggregateBase = estypes.AggregationsSingleMetricAggregateBase;
export type AggregationsBuckets<TBucket> = estypes.AggregationsBuckets<TBucket>;
