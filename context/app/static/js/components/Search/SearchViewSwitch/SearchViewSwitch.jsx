import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ListRoundedIcon from '@material-ui/icons/ListRounded';
import GridOnRoundedIcon from '@material-ui/icons/GridOnRounded';
import BodyRoundedIcon from '@material-ui/icons/AccessibilityNewRounded';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { TooltipToggleButton } from 'js/shared-styles/buttons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import useSearchViewStore from 'js/stores/useSearchViewStore';

const searchViewStoreSelector = (state) => ({
  searchView: state.searchView,
  setSearchView: state.setSearchView,
  setToggleItem: state.setToggleItem,
});

function SearchViewSwitch(props) {
  const { toggleItem } = props;
  const { searchView, setSearchView, setToggleItem } = useSearchViewStore(searchViewStoreSelector);

  useEffect(() => {
    setToggleItem(toggleItem);
  }, [setToggleItem, toggleItem]);

  function handleChangeView(view) {
    if (!['table', 'tile', 'ccf'].includes(view)) {
      return;
    }
    setSearchView(view);
    toggleItem(view);
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
        <GridOnRoundedIcon color={searchView === 'tile' ? 'primary' : 'secondary'} />
      </TooltipToggleButton>
      <TooltipToggleButton
        tooltipComponent={SecondaryBackgroundTooltip}
        tooltipTitle="Switch to CCF View"
        disableRipple
        value="ccf"
        id="ccf-view-toggle-button"
      >
        <BodyRoundedIcon color={searchView === 'ccf' ? 'primary' : 'secondary'} />
      </TooltipToggleButton>
    </ToggleButtonGroup>
  );
}

SearchViewSwitch.propTypes = {
  toggleItem: PropTypes.func.isRequired,
};

export default SearchViewSwitch;
