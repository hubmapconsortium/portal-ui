import React, { useContext, useState } from 'react';
import { ThemeContext } from 'styled-components';
import Joyride, { STATUS } from 'react-joyride';

import TutorialTooltip from 'js/components/tutorials/TutorialTooltip';
import useSearchViewStore from 'js/stores/useSearchViewStore';

const viewMoreSelector = '#Data-Type > div.sk-refinement-list__view-more-action';

const searchViewStoreSelector = (state) => ({ searchView: state.searchView, toggleItem: state.toggleItem });

const defaultSteps = [
  {
    target: '#Data-Type > div.sk-item-list > div:nth-child(1)',
    disableBeacon: true,
    content:
      'The Dataset Metadata menu on the left side allows filtering datasets by any combination of metadata categories: Data Type, Organ and Specimen Type. Search results update automatically as you edit the selection of filters. ',
    title: 'Filter Your Browsing',
  },
  {
    target: 'div.sk-search-box',
    content:
      'To further narrow the relevant datasets, type search terms or phrases in “quotes" into the Search bar. Multiple “search terms” should be separated by OR.',
    disableBeacon: true,
    title: 'Search Datasets by Free Text',
  },
  {
    target: 'div.sk-layout__results.sk-results-list > table > thead > tr > th:nth-child(3)',
    content:
      'Press the arrow button by the relevant column to sort search results. A bolded arrow indicates the current sorting selection. Selecting a bolded arrow will reverse the sorting order.   ',
    disableBeacon: true,
    title: 'Sort Search Results',
  },
  {
    target: '#tile-view-toggle-button',
    content:
      'Toggle the results display mode between list view and tile view. Click the tile view button above to continue.',
    title: 'Toggle Display Mode',
    disableBeacon: true,
    spotlightClicks: true,
  },
  {
    target: '#search-tiles-sort-button',
    content: 'To sort your search results in grid view, select your sorting option in this dropdown menu.',
    disableBeacon: true,
    title: 'Sort Search Results for Tile View',
  },
];

const stepToAddIfViewMoreExists = {
  target: '#Data-Type > div.sk-refinement-list__view-more-action',
  content: 'Click the View All button to display the entire list of filters in the selected category.',
  disableBeacon: true,
  title: 'View More Filters',
};

function SearchDatasetTutorial({ runTutorial, setRunTutorial, stepIndex }) {
  const themeContext = useContext(ThemeContext);
  const [steps, setSteps] = useState(defaultSteps);
  const { searchView, toggleItem } = useSearchViewStore(searchViewStoreSelector);

  const handleJoyrideCallback = (data) => {
    const {
      status,
      action,
      step: { title },
    } = data;

    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (action === 'prev' && title === 'Sort Search Results for Tile View' && searchView === 'tile') {
      toggleItem('table');
    }

    if (finishedStatuses.includes(status) || action === 'close') {
      setRunTutorial(false);
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
      tooltipComponent={TutorialTooltip}
      styles={{ options: { arrowColor: themeContext.palette.info.dark } }}
      stepIndex={stepIndex}
    />
  );
}

export default SearchDatasetTutorial;
