import React, { useCallback } from 'react';
import ListRoundedIcon from '@mui/icons-material/ListRounded';
import GridOnRoundedIcon from '@mui/icons-material/GridOnRounded';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Button, SvgIcon } from '@mui/material';

import { TooltipToggleButton } from 'js/shared-styles/buttons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { trackEvent } from 'js/helpers/trackers';
import { useSearchStore } from './store';

function SearchViewSwitch({ views }: { views: { label: string; icon: typeof SvgIcon }[] }) {
  const { view, setView, analyticsCategory } = useSearchStore();

  const handleChange = useCallback(
    (event: React.MouseEvent<HTMLElement>, v: string) => {
      trackEvent({
        category: analyticsCategory,
        action: `Switch Search View`,
        label: `${v}`,
      });
      setView(v);
    },
    [setView, analyticsCategory],
  );

  return (
    <ToggleButtonGroup value={view} exclusive onChange={handleChange}>
      {views.map(({ label, icon: Icon }) => (
        <TooltipToggleButton
          tooltipComponent={SecondaryBackgroundTooltip}
          buttonComponent={Button}
          tooltipTitle={`Switch to ${label} View`}
          disableRipple
          value={label.toLowerCase()}
          id={`${label.toLowerCase()}-view-toggle-button`}
          disabled={view === label.toLowerCase()}
          key={label}
        >
          <Icon color={view === label.toLowerCase() ? 'primary' : 'secondary'} />
        </TooltipToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

const defaultViews = [
  { label: 'Table', icon: ListRoundedIcon },
  { label: 'Tile', icon: GridOnRoundedIcon },
];

function DefaultSearchViewSwitch() {
  return <SearchViewSwitch views={defaultViews} />;
}
export default SearchViewSwitch;

export { DefaultSearchViewSwitch };
