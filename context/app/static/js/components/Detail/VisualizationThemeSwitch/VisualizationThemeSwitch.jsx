import React from 'react';
import Switch from '@material-ui/core/Switch';
import { StyledSwitchGrid, StyledSwitchGridItem } from './style';

function VisualizationThemeSwitch(props) {
  const { theme, onChange } = props;
  return (
    <StyledSwitchGrid component="div" container alignItems="center" spacing={1}>
      <StyledSwitchGridItem item>
        <label htmlFor="visualization-theme-switch">Light</label>
      </StyledSwitchGridItem>
      <StyledSwitchGridItem item>
        <Switch
          checked={theme === 'dark'}
          onChange={onChange}
          name="visualization-theme-switch"
          id="visualization-theme-switch"
          size="small"
        />
      </StyledSwitchGridItem>
      <StyledSwitchGridItem item>
        <label htmlFor="visualization-theme-switch">Dark</label>
      </StyledSwitchGridItem>
    </StyledSwitchGrid>
  );
}

export default VisualizationThemeSwitch;
