import React from 'react';

import useSearchDatasetTutorialStore from 'js/stores/useSearchDatasetTutorialStore';
import TutorialTooltip from 'js/shared-styles/tutorials/TutorialTooltip';

const searchDatasetTutorialSelector = (state) => ({
  incrementSearchDatasetTutorialStep: state.incrementSearchDatasetTutorialStep,
  decrementSearchDatasetTutorialStep: state.decrementSearchDatasetTutorialStep,
  closeSearchDatasetTutorial: state.closeSearchDatasetTutorial,
});

function DatasetSearchTutorialTooltip(props) {
  const {
    incrementSearchDatasetTutorialStep,
    decrementSearchDatasetTutorialStep,
    closeSearchDatasetTutorial,
  } = useSearchDatasetTutorialStore(searchDatasetTutorialSelector);
  return (
    <TutorialTooltip
      {...props}
      incrementStepOnClick={incrementSearchDatasetTutorialStep}
      decrementStepOnClick={decrementSearchDatasetTutorialStep}
      closeOnClick={closeSearchDatasetTutorial}
    />
  );
}

export default DatasetSearchTutorialTooltip;
