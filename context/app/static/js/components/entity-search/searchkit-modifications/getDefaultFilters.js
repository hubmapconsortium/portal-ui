// Copied from https://www.searchkit.co/docs/core/customisations/customisations-filters
// Modified to handle our default filters

import { getDefaultQuery } from 'js/helpers/functions';

const filterIdentifier = 'defaultQueryFilters';
class DefaultFilters {
  // We cannot make getIdentifier and getFilters static methods because they are consumed by searchkit.

  // eslint-disable-next-line class-methods-use-this
  getIdentifier() {
    return filterIdentifier;
  }

  // eslint-disable-next-line class-methods-use-this
  getFilters() {
    return getDefaultQuery();
  }

  getSelectedFilter() {
    return {
      id: this.getIdentifier(),
      identifier: this.getIdentifier(),
    };
  }
}

function getDefaultFilters() {
  return {
    [filterIdentifier]: {
      definition: new DefaultFilters(),
      value: { identifier: filterIdentifier },
    },
  };
}

export { getDefaultFilters };
