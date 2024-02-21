/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
import { TermQuery, FilterBucket, BoolShould, FilterBasedAccessor } from 'searchkit';

import { LevelState, isParentLevel, PARENT_LEVEL, CHILD_LEVEL } from './LevelState';

function convertBucketsKeys(buckets) {
  return buckets.map((item) => {
    item.key = String(item.key);
    return item;
  });
}

function buildChildBuckets(parentBuckets, childField) {
  return parentBuckets.reduce((acc, parentBucket) => {
    const childBuckets = parentBucket[childField]?.buckets;
    childBuckets.forEach((childBucket) => acc.push({ ...childBucket, parentKey: parentBucket.key }));

    return acc;
  }, []);
}

function buildParentBuckets(parentBuckets, childField) {
  return parentBuckets.map((bucket) => ({ ...bucket, childField }));
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
    const parentField = fields[0];
    const childField = fields[1];

    const parentBuckets = this.getAggregations([this.options.id, parentField, 'buckets'], []);

    if (isParentLevel(level)) {
      return convertBucketsKeys(buildParentBuckets(parentBuckets, childField));
    }

    const childBuckets = buildChildBuckets(parentBuckets, childField);
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
      const filterTerms = filters.map((f) => TermQuery.bind(null, field, f)());

      if (filterTerms.length > 0) {
        query = query.addFilter(this.uuids[i], filterTerms.length > 1 ? BoolShould(filterTerms) : filterTerms[0]);
      }

      const selectedFilters = filters.map((f) => ({
        id: this.options.id,
        name: this.options.title,
        value: this.translate(f),
        remove: () => {
          this.state = this.state.remove(i, f);
        },
      }));

      query = query.addSelectedFilters(selectedFilters);
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
