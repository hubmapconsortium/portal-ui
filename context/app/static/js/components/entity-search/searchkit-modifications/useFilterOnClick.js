// Copied from https://github.com/searchkit/searchkit/blob/6d11b204520009a705fe207535bd4f18d083d361/packages/searchkit-client/src/components.tsx
// Modified FilterLink to be a hook which returns a click handler for facet components.
import { createSearchState, useSearchkit, useSearchkitRoutingOptions, useSearchkitVariables } from '@searchkit/client';

function isModifiedEvent(event) {
  const { target } = event.currentTarget;
  return (
    (target && target !== '_self') ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey || // triggers resource download
    (event.nativeEvent && event.nativeEvent.which === 2)
  );
}

const useFilterOnClick = (filter, resetPagination = true) => {
  const api = useSearchkit();
  const variables = useSearchkitVariables();
  const routingOptions = useSearchkitRoutingOptions();
  const filterAdded = api.isFilterSelected(filter);

  if (routingOptions) {
    const scs = createSearchState(variables);
    scs.toggleFilter(filter);
    if (resetPagination) scs.resetPage();
    if (filter?.level) {
      const appliedFilters = scs.getFiltersByIdentifier(filter.identifier);
      const levelFilters = appliedFilters.filter(
        (f) => f.level === filter.level || (!filterAdded && f.level > filter.level),
      );
      if (levelFilters?.length > 0) {
        levelFilters.forEach((f) => scs.removeFilter(f));
      }
    }
  }

  const clickHandler = (e) => {
    const { nodeName } = e.currentTarget;

    if (nodeName === 'A' && isModifiedEvent(e)) {
      return;
    }

    e.preventDefault();

    api.toggleFilter(filter);
    if (resetPagination) api.resetPage();
    if (filter?.level) {
      const appliedFilters = api.getFiltersByIdentifier(filter.identifier);
      const levelFilters = appliedFilters.filter((f) => f.level === filter.level || f.level > filter.level);
      if (levelFilters?.length > 0) {
        levelFilters.forEach((f) => api.removeFilter(f));
      }
    }
    api.search();
  };
  return clickHandler;
};

export default useFilterOnClick;
