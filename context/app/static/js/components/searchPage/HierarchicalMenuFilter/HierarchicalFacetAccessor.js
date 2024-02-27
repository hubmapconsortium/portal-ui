/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import { TermQuery, FilterBucket, BoolShould, FilterBasedAccessor } from 'searchkit';

import { LevelState, isParentLevel, PARENT_LEVEL, CHILD_LEVEL } from './LevelState';

function convertBucketsKeys(buckets) {
  return buckets.map((item) => {
    item.key = String(item.key);
    return item;
  });
}

function buildChildBuckets({ aggregations, childField, selectedState }) {
  const aggsBuckets = aggregations.reduce(
    (acc, parentBucket) => {
      const childBuckets = parentBucket[childField]?.buckets.map((b) => ({ ...b, parentKey: parentBucket.key }));
      acc.keys = new Set([...acc.keys, ...childBuckets.map((b) => b.key)]);
      acc.buckets = [...acc.buckets, ...childBuckets];
      return acc;
    },
    {
      keys: new Set([]),
      buckets: [],
    },
  );

  const selectedBuckets = Object.entries(selectedState).reduce((acc, [parentKey, childKeys]) => {
    childKeys.forEach((childKey) => {
      if (!aggsBuckets.keys.has(childKey)) {
        acc.push({ key: childKey, parentKey, doc_count: 0 });
      }
    });
    return acc;
  }, []);

  return [...aggsBuckets.buckets, ...selectedBuckets];
}

function buildParentBuckets({ aggregations, childField, selectedState }) {
  const aggsBuckets = aggregations.reduce((acc, parentBucket) => {
    acc[parentBucket.key] = { ...parentBucket, childField };
    return acc;
  }, {});

  const selectedBuckets = Object.keys(selectedState)
    .filter((key) => aggsBuckets?.[key] === undefined)
    .map((key) => ({ key, childField, doc_count: 0 }));

  return [...Object.values(aggsBuckets), ...selectedBuckets];
}

export class HierarchicalFacetAccessor extends FilterBasedAccessor {
  state = new LevelState();

  options;

  uuids;

  constructor(key, options) {
    super(key);
    this.options = options;
    this.computeUuids();
  }

  computeUuids() {
    this.uuids = this.options.fields.map((field) => this.uuid + field);
  }

  onResetFilters() {
    this.resetState();
  }

  getBuckets(level) {
    if (level > CHILD_LEVEL) {
      return [];
    }
    const { fields } = this.options;
    const parentField = fields[PARENT_LEVEL];
    const childField = fields[CHILD_LEVEL];

    const aggregations = this.getAggregations([this.options.id, parentField, 'buckets'], []);

    const selectedState = this.state.getValue();

    if (isParentLevel(level)) {
      return convertBucketsKeys(buildParentBuckets({ aggregations, childField, selectedState }));
    }

    const childBuckets = buildChildBuckets({ aggregations, childField, selectedState });

    return convertBucketsKeys(childBuckets);
  }

  getOrder() {
    if (this.options.orderKey) {
      const orderDirection = this.options.orderDirection || 'asc';
      return { [this.options.orderKey]: orderDirection };
    }
  }

  buildSharedQuery(query) {
    this.options.fields.forEach((field, i) => {
      const filters = this.state.getLevel(i);
      const filterTerms = filters.map((f) => TermQuery.bind(null, field, f.key)());

      if (filterTerms.length > 0) {
        query = query.addFilter(this.uuids[i], filterTerms.length > 1 ? BoolShould(filterTerms) : filterTerms[0]);
      }

      if (i === CHILD_LEVEL) {
        const selectedFilters = filters.map((f) => ({
          id: this.options.id,
          name: this.options.title,
          value: this.translate(f.key),
          remove: () => {
            this.state = this.state.remove(i, f);
          },
        }));

        query = query.addSelectedFilters(selectedFilters);
      }
    });

    return query;
  }

  buildOwnQuery(query) {
    const subAggs = {
      [this.options.fields[PARENT_LEVEL]]: {
        terms: {
          field: this.options.fields[PARENT_LEVEL],
        },
        aggs: {
          [this.options.fields[CHILD_LEVEL]]: {
            terms: {
              field: this.options.fields[CHILD_LEVEL],
            },
          },
        },
      },
    };
    return query.setAggs(FilterBucket(this.options.id, query.getFiltersWithoutKeys(this.uuids), subAggs));
  }
}
