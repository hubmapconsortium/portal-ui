import React from 'react';
import WbSunnyIcon from '@mui/icons-material/WbSunnyRounded';
import Brightness2Icon from '@mui/icons-material/Brightness2Rounded';

import useVisualizationStore from 'js/stores/useVisualizationStore';
import { TooltipToggleButton } from 'js/shared-styles/buttons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { StyledToggleButtonGroup } from './style';

const visualizationStoreSelector = (state) => ({
  vizTheme: state.vizTheme,
  setVizTheme: state.setVizTheme,
});

function VisualizationThemeSwitch() {
  const { vizTheme, setVizTheme } = useVisualizationStore(visualizationStoreSelector);
  const trackEntityPageEvent = useTrackEntityPageEvent();

  return (
    <StyledToggleButtonGroup
      value={vizTheme}
      exclusive
      onChange={(_, theme) => {
        // No theme arg means the user clicked on the already active theme.
        if (!theme) {
          trackEntityPageEvent({ action: 'Vitessce / Selected Already Active Theme' });
          return;
        }
        trackEntityPageEvent({ action: `Vitessce / Toggle ${theme} Theme` });
        setVizTheme(theme);
      }}
      size="small"
    >
      <TooltipToggleButton
        tooltipComponent={SecondaryBackgroundTooltip}
        tooltipTitle="Switch to Light Theme"
        disableRipple
        value="light"
        aria-label="Visualization light theme button"
      >
        <WbSunnyIcon color={vizTheme === 'light' ? 'primary' : 'secondary'} />
      </TooltipToggleButton>
      <TooltipToggleButton
        tooltipComponent={SecondaryBackgroundTooltip}
        tooltipTitle="Switch to Dark Theme"
        disableRipple
        value="dark"
        aria-label="Visualization dark theme button"
      >
        <Brightness2Icon color={vizTheme !== 'light' ? 'primary' : 'secondary'} />
      </TooltipToggleButton>
    </StyledToggleButtonGroup>
  );
}

export default VisualizationThemeSwitch;
