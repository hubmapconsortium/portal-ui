import React, { useState } from 'react';
import Joyride, { STATUS, ACTIONS, LIFECYCLE } from 'react-joyride';

import DatasetSearchPrompt from 'js/components/tutorials/DatasetSearchPrompt';
import TutorialTooltip from 'js/shared-styles/tutorials/TutorialTooltip';
import useSearchViewStore from 'js/stores/useSearchViewStore';
import { useTutorialStore, withTutorialProvider } from 'js/shared-styles/tutorials/TutorialProvider';
import { useTheme } from '@mui/material/styles';
import { sortTileViewStepTitle, defaultSteps, stepToAddIfViewMoreExists } from './config';

const searchViewStoreSelector = (state) => ({
  searchView: state.searchView,
  setSearchView: state.setSearchView,
  toggleItem: state.toggleItem,
});

const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

function SearchDatasetTutorial() {
  const themeContext = useTheme();
  const [steps, setSteps] = useState(defaultSteps);
  const { searchView, setSearchView, toggleItem } = useSearchViewStore(searchViewStoreSelector);
  const { tutorialStep, isTutorialRunning, closeTutorial } = useTutorialStore();

  const handleJoyrideCallback = (data) => {
    const {
      status,
      action,
      lifecycle,
      step: { title },
    } = data;

    if (action === ACTIONS.START && lifecycle === LIFECYCLE.INIT && title === 'Filter Your Browsing') {
      if (searchView === 'tile') {
        setSearchView('table');
        toggleItem('table');
      }
    }

    // If the user selects back after tile view has been toggled, return to table view.
    if (action === ACTIONS.PREV && title === sortTileViewStepTitle && searchView === 'tile') {
      toggleItem('table');
      setSearchView('table');
    }

    if (action === ACTIONS.NEXT && title === sortTileViewStepTitle && searchView === 'table') {
      toggleItem('tile');
      setSearchView('tile');
    }

    // If the user clicks the overlay or highlighted element, close the search tutorial.
    if (finishedStatuses.includes(status) || action === ACTIONS.CLOSE) {
      closeTutorial();
    }
  };

  React.useEffect(() => {
    if (isTutorialRunning) {
      const element = document.querySelector(stepToAddIfViewMoreExists.target);
      if (element) {
        const defaultStepsCopy = [...defaultSteps];
        defaultStepsCopy.splice(1, 0, stepToAddIfViewMoreExists);
        setSteps(defaultStepsCopy);
      }
    }
  }, [isTutorialRunning]);

  const {
    palette: {
      info: { dark: arrowColor },
    },
    zIndex: { tutorial: zIndex },
  } = themeContext;

  return (
    <>
      <DatasetSearchPrompt />
      <Joyride
        steps={steps}
        callback={handleJoyrideCallback}
        run={isTutorialRunning}
        scrollOffset={100}
        floaterProps={{
          disableAnimation: true,
        }}
        tooltipComponent={TutorialTooltip}
        styles={{ options: { arrowColor, zIndex } }}
        stepIndex={tutorialStep}
      />
    </>
  );
}

export default withTutorialProvider(SearchDatasetTutorial, 'dataset_search');
