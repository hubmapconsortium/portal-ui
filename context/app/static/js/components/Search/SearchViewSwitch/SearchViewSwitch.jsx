import React from 'react';
import PropTypes from 'prop-types';
import ListRoundedIcon from '@material-ui/icons/ListRounded';
import GridOnRoundedIcon from '@material-ui/icons/GridOnRounded';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { TooltipToggleButton } from 'js/shared-styles/buttons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import useSearchViewStore from 'js/stores/useSearchViewStore';
import useSearchDatasetTutorialStore from 'js/stores/useSearchDatasetTutorialStore';

const searchViewStoreSelector = (state) => ({
  searchView: state.searchView,
  setSearchView: state.setSearchView,
});

const searchDatasetTutorialSelector = (state) => ({
  runSearchDatasetTutorial: state.runSearchDatasetTutorial,
  incrementSearchDatasetTutorialStep: state.incrementSearchDatasetTutorialStep,
});

function SearchViewSwitch(props) {
  const { toggleItem } = props;
  const { searchView, setSearchView } = useSearchViewStore(searchViewStoreSelector);

  const { runSearchDatasetTutorial, incrementSearchDatasetTutorialStep } = useSearchDatasetTutorialStore(
    searchDatasetTutorialSelector,
  );

  function handleChangeView(view) {
    if (!['table', 'tile'].includes(view)) {
      return;
    }
    setSearchView(view);
    toggleItem(view);
    if (view === 'tile' && runSearchDatasetTutorial) {
      incrementSearchDatasetTutorialStep();
    }
  }

  return (
    <ToggleButtonGroup value={searchView} exclusive onChange={(e, view) => handleChangeView(view)}>
      <TooltipToggleButton
        tooltipComponent={SecondaryBackgroundTooltip}
        tooltipTitle="Switch to Table View"
        disableRipple
        value="table"
        id="table-view-toggle-button"
      >
        <ListRoundedIcon color={searchView === 'table' ? 'primary' : 'secondary'} />
      </TooltipToggleButton>
      <TooltipToggleButton
        tooltipComponent={SecondaryBackgroundTooltip}
        tooltipTitle="Switch to Tile View"
        disableRipple
        value="tile"
        id="tile-view-toggle-button"
      >
        <GridOnRoundedIcon color={searchView !== 'table' ? 'primary' : 'secondary'} />
      </TooltipToggleButton>
    </ToggleButtonGroup>
  );
}

SearchViewSwitch.propTypes = {
  toggleItem: PropTypes.func.isRequired,
};

export default SearchViewSwitch;
