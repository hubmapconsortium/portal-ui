import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import useSearchViewStore from 'js/stores/useSearchViewStore';
import useSearchDatasetTutorialStore from 'js/stores/useSearchDatasetTutorialStore';
import SearchPrompt from '../SearchPrompt';

const searchViewStoreSelector = (state) => ({
  setSearchView: state.setSearchView,
  searchView: state.searchView,
  toggleItem: state.toggleItem,
  searchHitsCount: state.searchHitsCount,
});

const searchDatasetStoreSelector = (state) => state.setTutorialHasExited;

function DatasetSearchPrompt({ setRunTutorial }) {
  const [isDisplayed, setIsDisplayed] = useState(true);
  const [timeoutHasRun, setTimeoutHasRun] = useState(false);

  const { searchView, setSearchView, toggleItem, searchHitsCount } = useSearchViewStore(searchViewStoreSelector);
  const setTutorialHasExited = useSearchDatasetTutorialStore(searchDatasetStoreSelector);

  function beginTutorial() {
    if (searchView === 'tile') {
      setSearchView('table');
      toggleItem('table');
    }
    setIsDisplayed(false);
    setRunTutorial(true);
  }

  /* TODO The enable button should be disabled based on whether the element targeted in the first step has mounted. 
  See https://github.com/hubmapconsortium/portal-ui/issues/1412 for more information. */
  useEffect(() => {
    setTimeout(() => setTimeoutHasRun(true), 1000);
  }, [setTimeoutHasRun]);

  function closePrompt() {
    setTutorialHasExited(true);
    setIsDisplayed(false);
  }

  return isDisplayed ? (
    <SearchPrompt
      headerText="Getting Started"
      descriptionText="Welcome to the HuBMAP Data Portal. Get a quick tour of different sections of the dataset search page."
      buttonText="Begin the Dataset Search Tutorial"
      buttonOnClick={beginTutorial}
      buttonIsDisabled={!timeoutHasRun || searchHitsCount === 0}
      closeOnClick={closePrompt}
    />
  ) : null;
}

DatasetSearchPrompt.propTypes = {
  setRunTutorial: PropTypes.func.isRequired,
};

export default DatasetSearchPrompt;
