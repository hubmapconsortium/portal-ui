import React, { useId } from 'react';
import WbSunnyIcon from '@mui/icons-material/WbSunnyRounded';
import Brightness2Icon from '@mui/icons-material/Brightness2Rounded';

import useVisualizationStore, { VisualizationStore } from 'js/stores/useVisualizationStore';
import { TooltipToggleButton } from 'js/shared-styles/buttons';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { EventInfo } from 'js/components/types';
import { StyledToggleButtonGroup } from './style';

const visualizationStoreSelector = (state: VisualizationStore) => ({
  vizTheme: state.vizTheme,
  setVizTheme: state.setVizTheme,
});

const buttonIcons = {
  dark: Brightness2Icon,
  light: WbSunnyIcon,
};

function VisualizationThemeSwitch({
  trackingInfo,
}: {
  trackingInfo: Omit<EventInfo, 'category'> & { category?: string };
}) {
  const { vizTheme, setVizTheme } = useVisualizationStore(visualizationStoreSelector);
  const trackEntityPageEvent = useTrackEntityPageEvent();

  const id = useId();

  return (
    <StyledToggleButtonGroup
      value={vizTheme}
      exclusive
      onChange={(_, theme: 'light' | 'dark') => {
        // No theme arg means the user clicked on the already active theme.
        if (!theme) {
          trackEntityPageEvent({
            ...trackingInfo,
            action: `${trackingInfo.action} / Selected Already Active Theme`,
          });
          return;
        }
        trackEntityPageEvent({
          ...trackingInfo,
          action: `${trackingInfo.action} / Toggle ${theme} Theme`,
        });
        setVizTheme(theme);
      }}
      size="small"
    >
      {(['light', 'dark'] as const).map((theme) => {
        const Icon = buttonIcons[theme];
        return (
          <TooltipToggleButton
            key={theme}
            id={`visualization-${theme}-theme-button-${id}`}
            tooltipTitle={`Switch to ${theme === 'light' ? 'Light' : 'Dark'} Theme`}
            disableRipple
            value={theme}
            aria-label={`Visualization ${theme} theme button`}
          >
            <Icon color={vizTheme === theme ? 'primary' : 'secondary'} />
          </TooltipToggleButton>
        );
      })}
    </StyledToggleButtonGroup>
  );
}

export default VisualizationThemeSwitch;
