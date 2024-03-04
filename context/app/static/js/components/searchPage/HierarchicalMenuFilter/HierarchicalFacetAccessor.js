/* eslint-disable no-param-reassign */
import { TermQuery, FilterBucket, BoolShould, FilterBasedAccessor } from 'searchkit';
import { produce } from 'immer';
import { LevelState, PARENT_LEVEL, CHILD_LEVEL } from './LevelState';

export function buildBuckets({ aggregations, childField, selectedState }) {
  const buckets = aggregations.reduce((acc, parentBucket) => {
    acc[parentBucket.key] = {
      ...parentBucket,
      buckets: Object.fromEntries(
        parentBucket?.[childField].buckets.map((b) => [b.key, { ...b, parentKey: parentBucket.key }]),
      ),
    };
    return acc;
  }, {});

  const bucketsWithSelectedState = Object.entries(selectedState).reduce((acc, [parentKey, childKeys]) => {
    return produce(acc, (draft) => {
      if (!draft?.[parentKey]) {
        draft[parentKey] = { key: parentKey, buckets: {}, doc_count: 0 };
      }

      childKeys.forEach((childKey) => {
        if (!draft[parentKey].buckets?.[childKey]) {
          draft[parentKey].buckets[childKey] = { key: childKey, doc_count: 0, parentKey };
        }
      });
      return draft;
    });
  }, buckets);
  return bucketsWithSelectedState;
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

  getBuckets() {
    const { fields } = this.options;
    const parentField = fields[PARENT_LEVEL];
    const childField = fields[CHILD_LEVEL];

    const aggregations = this.getAggregations([this.options.id, parentField, 'buckets'], []);
    const selectedState = this.state.getValue();

    return buildBuckets({ aggregations, childField, selectedState });
  }

  /* eslint-disable consistent-return */
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
