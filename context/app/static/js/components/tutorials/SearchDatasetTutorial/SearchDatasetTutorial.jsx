import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from 'styled-components';
import Joyride, { STATUS, ACTIONS } from 'react-joyride';

import TutorialTooltip from 'js/components/tutorials/TutorialTooltip';
import useSearchViewStore from 'js/stores/useSearchViewStore';

const viewMoreSelector = '#Data-Type div.sk-refinement-list__view-more-action';

const sortTileViewStepTitle = 'Sort Search Results for Tile View';

const searchViewStoreSelector = (state) => ({
  searchView: state.searchView,
  setSearchView: state.setSearchView,
  toggleItem: state.toggleItem,
});

const defaultSteps = [
  {
    target: '#Data-Type div.sk-item-list > div:nth-child(1)',
    disableBeacon: true,
    content: `The Dataset Metadata menu on the left side allows filtering datasets by any combination of metadata categories: Data Type, Organ and Specimen Type.
    Search results update automatically as you edit the selection of filters.`,
    title: 'Filter Your Browsing',
  },
  {
    target: 'div.sk-search-box',
    content:
      'To further narrow the relevant datasets, type search terms or phrases in “quotes" into the Search bar. Datasets containing any of the search terms will be returned.',
    disableBeacon: true,
    title: 'Search Datasets by Free Text',
  },
  {
    target: 'div.sk-layout__results.sk-results-list > table > thead > tr > th:nth-child(3)',
    content: `Clicking the arrow button by the relevant column will sort search results.
    A bolded arrow indicates the current sorting selection.
    Clicking again will reverse the order.`,
    disableBeacon: true,
    title: 'Sort Search Results',
  },
  {
    target: '#tile-view-toggle-button',
    content: 'Toggling the results display mode will switch between table view and tile view.',
    title: 'Toggle Display Mode',
    disableBeacon: true,
  },
  {
    target: '#search-tiles-sort-button',
    content: 'Selecting your sorting option in this dropdown menu will sort your search results in tile view.',
    disableBeacon: true,
    title: sortTileViewStepTitle,
  },
];

const stepToAddIfViewMoreExists = {
  target: '#Data-Type div.sk-refinement-list__view-more-action',
  content: 'Clicking the "View All" button will display the entire list of filters in the selected category.',
  disableBeacon: true,
  title: 'View More Filters',
};

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
      tooltipComponent={TutorialTooltip}
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
