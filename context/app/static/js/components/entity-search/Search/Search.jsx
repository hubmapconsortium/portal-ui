import React from 'react';

import { SearchkitClient, withSearchkit } from '@searchkit/client';

import { SuccessSnackbar, useSnackbarStore } from 'js/shared-styles/snackbars';
import withSearchkitRouting from 'js/components/entity-search/searchkit-modifications/withSearchkitRouting';
import Sidebar from 'js/components/entity-search/sidebar/Sidebar';
import SearchBar from 'js/components/entity-search/SearchBar';
import FacetChips from 'js/components/entity-search/facets/facetChips/FacetChips';
import MetadataMenu from 'js/components/entity-search/MetadataMenu/';
import SearchViewSwitch from 'js/components/entity-search/results/SearchViewSwitch';
import Results from 'js/components/entity-search/results/Results';
import { Flex, Grow } from './style';
import { useSearch } from './hooks';

const defaultPageSize = 18;

const createSkClient = () =>
  new SearchkitClient({
    itemsPerPage: defaultPageSize,
  });

function Search() {
  const { results, allResultsUUIDs, entityType } = useSearch();
  const { snackbarOpen, closeSnackbar, messages } = useSnackbarStore();

  return (
    <>
      <Flex>
        <Grow>
          <SearchBar />
        </Grow>
        <MetadataMenu allResultsUUIDs={allResultsUUIDs} entityType={entityType} results={results} />
        <SearchViewSwitch />
      </Flex>
      {results?.summary.appliedFilters && <FacetChips appliedFilters={results.summary.appliedFilters} />}
      <Flex>
        <Sidebar results={results} />
        <Results results={results} allResultsUUIDs={allResultsUUIDs} />
      </Flex>
      <SuccessSnackbar
        // This key forces a re-render when the message changes and resets the timer for autoHideDuration
        key={messages[0]}
        open={snackbarOpen}
        onClose={closeSnackbar}
        message={messages[0]}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      />
    </>
  );
}

export default withSearchkit(withSearchkitRouting(Search), createSkClient);
