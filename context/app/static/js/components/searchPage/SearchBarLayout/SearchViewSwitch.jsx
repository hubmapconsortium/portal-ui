import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ListRoundedIcon from '@mui/icons-material/ListRounded';
import GridOnRoundedIcon from '@mui/icons-material/GridOnRounded';
import BodyRoundedIcon from '@mui/icons-material/AccessibilityNewRounded';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { trackEvent } from 'js/helpers/trackers';

import { TooltipToggleButton } from 'js/shared-styles/buttons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import useSearchViewStore from 'js/stores/useSearchViewStore';

const searchViewStoreSelector = (state) => ({
  searchView: state.searchView,
  setSearchView: state.setSearchView,
  setToggleItem: state.setToggleItem,
});

function createSearchViewSwitch(labelIconPairs) {
  return function SearchViewSwitch({ toggleItem, analyticsCategory }) {
    const { searchView, setSearchView, setToggleItem } = useSearchViewStore(searchViewStoreSelector);

    useEffect(() => {
      setToggleItem(toggleItem);
    }, [setToggleItem, toggleItem]);

    function handleChangeView(view) {
      const validViews = labelIconPairs.map(({ label }) => label.toLowerCase());
      if (!validViews.includes(view)) {
        return;
      }
      trackEvent({
        category: analyticsCategory,
        action: `Switch Search View`,
        label: `${view}`,
      });
      setSearchView(view);
      toggleItem(view);
    }

    return (
      <ToggleButtonGroup value={searchView} exclusive onChange={(e, view) => handleChangeView(view)}>
        {labelIconPairs.map(({ label, Icon }) => (
          <TooltipToggleButton
            tooltipComponent={SecondaryBackgroundTooltip}
            tooltipTitle={`Switch to ${label} View`}
            disableRipple
            value={label.toLowerCase()}
            id={`${label.toLowerCase()}-view-toggle-button`}
            key={label}
          >
            <Icon color={searchView === label.toLowerCase() ? 'primary' : 'secondary'} />
          </TooltipToggleButton>
        ))}
      </ToggleButtonGroup>
    );
  };
}

const SearchViewSwitch = createSearchViewSwitch([
  { label: 'Table', Icon: ListRoundedIcon },
  { label: 'Tile', Icon: GridOnRoundedIcon },
]);

const DevSearchViewSwitch = createSearchViewSwitch([
  { label: 'Table', Icon: ListRoundedIcon },
  { label: 'CCF', Icon: BodyRoundedIcon },
]);

SearchViewSwitch.propTypes = {
  toggleItem: PropTypes.func.isRequired,
};
DevSearchViewSwitch.propTypes = {
  toggleItem: PropTypes.func.isRequired,
};

export default SearchViewSwitch;
export { DevSearchViewSwitch };
