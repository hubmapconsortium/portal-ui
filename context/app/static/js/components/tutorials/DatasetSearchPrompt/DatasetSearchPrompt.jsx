import React, { useState, useEffect } from 'react';

import useSearchViewStore from 'js/stores/useSearchViewStore';
import Prompt from 'js/shared-styles/tutorials/Prompt';

const searchViewStoreSelector = (state) => ({
  searchHitsCount: state.searchHitsCount,
});

function DatasetSearchPrompt() {
  const [timeoutHasRun, setTimeoutHasRun] = useState(false);

  const { searchHitsCount } = useSearchViewStore(searchViewStoreSelector);

  /* TODO The enable button should be disabled based on whether the element targeted in the first step has mounted. 
  See https://github.com/hubmapconsortium/portal-ui/issues/1412 for more information. */
  useEffect(() => {
    setTimeout(() => setTimeoutHasRun(true), 1000);
  }, [setTimeoutHasRun]);

  return (
    <Prompt
      headerText="Getting Started"
      descriptionText="Welcome to the HuBMAP Data Portal. Get a quick tour of different sections of the dataset search page."
      buttonText="Begin the Dataset Search Tutorial"
      buttonIsDisabled={!timeoutHasRun || searchHitsCount === 0}
    />
  );
}

export default DatasetSearchPrompt;
