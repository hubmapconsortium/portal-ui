import { createRegexQuery } from '@searchkit/sdk/lib/cjs/facets/utils';

class RefinementSelectFacet {
  constructor(config) {
    this.config = config;
    this.excludeOwnFilters = false;
    this.excludeOwnFilters = this.config.multipleSelect;
  }

  getLabel() {
    return this.config.label;
  }

  getIdentifier() {
    return this.config.identifier;
  }

  getFilters(filters) {
    const condition = this.excludeOwnFilters ? 'should' : 'must';
    return {
      bool: {
        [condition]: filters.map((term) => ({ term: { [this.config.field]: term.value } })),
      },
    };
  }

  getAggregation(overrides) {
    const orderMap = {
      count: { _count: 'desc' },
      value: { _key: 'asc' },
    };
    return {
      [this.getIdentifier()]: {
        terms: {
          field: this.config.field,
          size: overrides?.size || this.config.size || 5,
          ...(this.config.order ? { order: orderMap[this.config.order] } : {}),
          ...(overrides?.query ? { include: createRegexQuery(overrides.query) } : {}),
        },
      },
    };
  }

  getSelectedFilter(filterSet) {
    return {
      identifier: this.getIdentifier(),
      id: `${this.getIdentifier()}_${filterSet.value}`,
      label: this.getLabel(),
      display: this.config.display || 'ListFacet',
      type: 'ValueSelectedFilter',
      value: filterSet.value,
    };
  }

  transformResponse(response) {
    return {
      identifier: this.getIdentifier(),
      label: this.getLabel(),
      display: this.config.display || 'ListFacet',
      type: 'RefinementSelectFacet',
      entries: response.buckets.map((entry) => ({
        label: entry.key,
        count: entry.doc_count,
      })),
      sumOtherDocCount: response.sum_other_doc_count,
    };
  }
}

export default RefinementSelectFacet;
