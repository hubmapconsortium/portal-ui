import React, { useState, useEffect } from 'react';

import { SearchkitClient, withSearchkit } from '@searchkit/client';

import { SuccessSnackbar } from 'js/shared-styles/snackbars';
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
  const [snackbarOpen, setSnackbarOpen] = useState(true);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSnackbarOpen(true); // Open the Snackbar after a delay
    }, 3000); // 3 seconds delay

    // Clean up the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

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
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message="Copied to clipboard."
        autoHideDuration={1000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      />
    </>
  );
}

export default withSearchkit(withSearchkitRouting(Search), createSkClient);
