import React from 'react';
import ListRoundedIcon from '@material-ui/icons/ListRounded';
import GridOnRoundedIcon from '@material-ui/icons/GridOnRounded';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { TooltipToggleButton } from 'js/shared-styles/buttons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

function SearchViewSwitch({ searchView, setSearchView }) {
  return (
    <ToggleButtonGroup value={searchView} exclusive onChange={(e, theme) => setSearchView(theme)}>
      <TooltipToggleButton
        tooltipComponent={SecondaryBackgroundTooltip}
        tooltipTitle="Switch to Table View"
        disableRipple
        value="table"
      >
        <ListRoundedIcon color={searchView === 'table' ? 'primary' : 'secondary'} />
      </TooltipToggleButton>
      <TooltipToggleButton
        tooltipComponent={SecondaryBackgroundTooltip}
        tooltipTitle="Switch to Tile View"
        disableRipple
        value="tile"
      >
        <GridOnRoundedIcon color={searchView !== 'table' ? 'primary' : 'secondary'} />
      </TooltipToggleButton>
    </ToggleButtonGroup>
  );
}

export default SearchViewSwitch;
