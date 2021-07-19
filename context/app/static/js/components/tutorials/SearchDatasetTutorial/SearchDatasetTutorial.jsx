import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from 'styled-components';
import Joyride, { STATUS, ACTIONS } from 'react-joyride';

import DatasetSearchTutorialTooltip from 'js/components/tutorials/DatasetSearchTutorialTooltip';
import useSearchViewStore from 'js/stores/useSearchViewStore';
import { sortTileViewStepTitle, defaultSteps, stepToAddIfViewMoreExists } from './config';

const viewMoreSelector = '#Data-Type div.sk-refinement-list__view-more-action';

const searchViewStoreSelector = (state) => ({
  searchView: state.searchView,
  setSearchView: state.setSearchView,
  toggleItem: state.toggleItem,
});

function SearchDatasetTutorial({ runTutorial, closeSearchDatasetTutorial, stepIndex }) {
  const themeContext = useContext(ThemeContext);
  const [steps, setSteps] = useState(defaultSteps);
  const { searchView, setSearchView, toggleItem } = useSearchViewStore(searchViewStoreSelector);

  const handleJoyrideCallback = (data) => {
    const {
      status,
      action,
      step: { title },
    } = data;

    // If the user selects back after tile view has been toggled, return to table view.
    if (action === ACTIONS.PREV && title === sortTileViewStepTitle && searchView === 'tile') {
      toggleItem('table');
      setSearchView('table');
    }

    if (action === ACTIONS.NEXT && title === sortTileViewStepTitle && searchView === 'table') {
      toggleItem('tile');
      setSearchView('tile');
    }

    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    // If the user clicks the overlay or highlighted element, close the search tutorial.
    if (finishedStatuses.includes(status) || action === ACTIONS.CLOSE) {
      closeSearchDatasetTutorial();
    }
  };

  React.useEffect(() => {
    if (runTutorial) {
      const element = document.querySelector(viewMoreSelector);
      if (element) {
        const defaultStepsCopy = [...defaultSteps];
        defaultStepsCopy.splice(1, 0, stepToAddIfViewMoreExists);
        setSteps(defaultStepsCopy);
      }
    }
  }, [runTutorial]);

  return (
    <Joyride
      steps={steps}
      callback={handleJoyrideCallback}
      run={runTutorial}
      scrollOffset={100}
      floaterProps={{
        disableAnimation: true,
      }}
      tooltipComponent={DatasetSearchTutorialTooltip}
      styles={{ options: { arrowColor: themeContext.palette.info.dark, zIndex: themeContext.zIndex.tutorial } }}
      stepIndex={stepIndex}
    />
  );
}

SearchDatasetTutorial.propTypes = {
  runTutorial: PropTypes.bool.isRequired,
  closeSearchDatasetTutorial: PropTypes.func.isRequired,
  stepIndex: PropTypes.number.isRequired,
};

export default SearchDatasetTutorial;
