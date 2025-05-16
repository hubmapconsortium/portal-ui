import { createSearchContext } from 'js/helpers/context/SearchContext';

const {
  SearchProvider: PublicationsSearchProvider,
  useSearchState: usePublicationsSearchState,
  useSearchActions: usePublicationsSearchActions,
} = createSearchContext();

export default PublicationsSearchProvider;
export { usePublicationsSearchState, usePublicationsSearchActions };
