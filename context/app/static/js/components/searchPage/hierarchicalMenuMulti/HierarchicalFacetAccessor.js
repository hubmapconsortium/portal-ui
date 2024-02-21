/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
import { TermQuery, FilterBucket, BoolShould, FilterBasedAccessor } from 'searchkit';

import { LevelState, isParentLevel } from './LevelState';

const map = require('lodash/map');
const each = require('lodash/each');

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
    this.uuids = map(this.options.fields, (field) => this.uuid + field);
  }

  onResetFilters() {
    this.resetState();
  }

  getBuckets(level) {
    if (level > 1) {
      return [];
    }
    const isChildLevel = !isParentLevel(level);

    const { fields } = this.options;

    const parentField = fields[0];
    const childField = fields[1];

    const parentBuckets = this.getAggregations([this.options.id, parentField, 'buckets'], []);
    if (isChildLevel) {
      const childBuckets = buildChildBuckets(parentBuckets, childField);
      return convertBucketsKeys(childBuckets);
    }

    return convertBucketsKeys(buildParentBuckets(parentBuckets, childField));
  }

  getOrder() {
    if (this.options.orderKey) {
      const orderDirection = this.options.orderDirection || 'asc';
      return { [this.options.orderKey]: orderDirection };
    }
  }

  buildSharedQuery(query) {
    each(this.options.fields, (field, i) => {
      const filters = this.state.getLevel(i);
      const filterTerms = map(filters, TermQuery.bind(null, field));

      if (filterTerms.length > 0) {
        query = query.addFilter(this.uuids[i], filterTerms.length > 1 ? BoolShould(filterTerms) : filterTerms[0]);
      }

      const selectedFilters = map(filters, (filter) => ({
        id: this.options.id,
        name: this.options.title,
        value: this.translate(filter),
        remove: () => {
          this.state = this.state.remove(i, filter);
        },
      }));

      query = query.addSelectedFilters(selectedFilters);
    });

    return query;
  }

  buildOwnQuery(query) {
    const subAggs = {
      [this.options.fields[0]]: {
        terms: {
          field: this.options.fields[0],
        },
        aggs: {
          [this.options.fields[1]]: {
            terms: {
              field: this.options.fields[1],
            },
          },
        },
      },
    };
    return query.setAggs(FilterBucket(this.options.id, query.getFiltersWithoutKeys(this.uuids), subAggs));
  }
}
