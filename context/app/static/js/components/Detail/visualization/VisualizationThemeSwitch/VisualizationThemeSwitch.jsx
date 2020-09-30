import React from 'react';
import WbSunnyIcon from '@material-ui/icons/WbSunnyRounded';
import Brightness2Icon from '@material-ui/icons/Brightness2Rounded';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import useEntityStore from 'js/stores/useEntityStore';
import { TooltipToggleButton } from 'js/shared-styles/buttons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import 'vitessce/dist/es/production/static/css/index.css';

const entitySelector = (state) => ({
  vizTheme: state.vizTheme,
  setVizTheme: state.setVizTheme,
});

function VisualizationThemeSwitch({ toggleButtonComponent }) {
  const { vizTheme, setVizTheme } = useEntityStore(entitySelector);

  function handleThemeChange(theme) {
    if (!['dark', 'light'].includes(theme)) {
      return;
    }

    setVizTheme(theme);
  }

  return (
    <ToggleButtonGroup value={vizTheme} exclusive onChange={(e, theme) => handleThemeChange(theme)} size="small">
      <TooltipToggleButton
        tooltipComponent={SecondaryBackgroundTooltip}
        tooltipTitle="Switch to Light Theme"
        buttonComponent={toggleButtonComponent}
        disableRipple
        value="light"
        aria-label="Visualization light theme button"
      >
        <WbSunnyIcon color={vizTheme === 'light' ? 'primary' : 'secondary'} />
      </TooltipToggleButton>
      <TooltipToggleButton
        tooltipComponent={SecondaryBackgroundTooltip}
        tooltipTitle="Switch to Dark Theme"
        buttonComponent={toggleButtonComponent}
        disableRipple
        value="dark"
        aria-label="Visualization dark theme button"
      >
        <Brightness2Icon color={vizTheme !== 'light' ? 'primary' : 'secondary'} />
      </TooltipToggleButton>
    </ToggleButtonGroup>
  );
}

export default VisualizationThemeSwitch;
