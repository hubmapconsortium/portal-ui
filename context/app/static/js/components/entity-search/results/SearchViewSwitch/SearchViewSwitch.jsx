import React from 'react';
import ListRoundedIcon from '@mui/icons-material/ListRounded';
import GridOnRoundedIcon from '@mui/icons-material/GridOnRounded';
import BodyRoundedIcon from '@mui/icons-material/AccessibilityNewRounded';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { TooltipToggleButton } from 'js/shared-styles/buttons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { useSearchConfigStore } from 'js/components/entity-search/SearchWrapper/store';

function createSearchViewSwitch(labelIconPairs) {
  return function SearchViewSwitch() {
    const { view, setView } = useSearchConfigStore();

    function handleChangeView(v) {
      const validViews = labelIconPairs.map(({ label }) => label.toLowerCase());
      if (!validViews.includes(v)) {
        return;
      }
      setView(v);
    }

    return (
      <ToggleButtonGroup value={view} exclusive onChange={(e, v) => handleChangeView(v)}>
        {labelIconPairs.map(({ label, Icon }) => (
          <TooltipToggleButton
            tooltipComponent={SecondaryBackgroundTooltip}
            tooltipTitle={`Switch to ${label} View`}
            disableRipple
            value={label.toLowerCase()}
            id={`${label.toLowerCase()}-view-toggle-button`}
            key={label}
          >
            <Icon color={view === label.toLowerCase() ? 'primary' : 'secondary'} />
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

export default SearchViewSwitch;
export { DevSearchViewSwitch };
