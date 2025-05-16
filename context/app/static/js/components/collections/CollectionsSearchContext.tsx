import { createSearchContext } from 'js/helpers/context/SearchContext';

const {
  SearchProvider: CollectionsSearchProvider,
  useSearchState: useCollectionsSearchState,
  useSearchActions: useCollectionsSearchActions,
} = createSearchContext();

export default CollectionsSearchProvider;
export { useCollectionsSearchState, useCollectionsSearchActions };
