import React from 'react';
import WbSunnyIcon from '@material-ui/icons/WbSunnyRounded';
import Brightness2Icon from '@material-ui/icons/Brightness2Rounded';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { SecondaryTooltip } from 'js/shared-styles/tooltips';
import { StyledToggleButton } from './style';
import 'vitessce/dist/es/production/static/css/index.css';

function VisualizationThemeSwitch(props) {
  const { theme, onChange } = props;
  return (
    <ToggleButtonGroup value={theme} exclusive onChange={onChange} size="small">
      <SecondaryTooltip title="Switch to Light Theme">
        <StyledToggleButton disableRipple value="light" aria-label="Visualization light theme button">
          <WbSunnyIcon color={theme === 'light' ? 'primary' : 'secondary'} />
        </StyledToggleButton>
      </SecondaryTooltip>
      <SecondaryTooltip title="Switch to Dark Theme">
        <StyledToggleButton disableRipple value="dark" aria-label="Visualization dark theme button">
          <Brightness2Icon color={theme !== 'light' ? 'primary' : 'secondary'} />
        </StyledToggleButton>
      </SecondaryTooltip>
    </ToggleButtonGroup>
  );
}

export default VisualizationThemeSwitch;
