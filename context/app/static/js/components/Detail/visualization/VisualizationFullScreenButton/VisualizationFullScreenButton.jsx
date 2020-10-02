import React from 'react';
import FullscreenExitRoundedIcon from '@material-ui/icons/FullscreenExitRounded';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMapRounded';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import useVisualizationStore from 'js/stores/useVisualizationStore';
import { FullScreenButton } from './style';

const visualizationStoreSelector = (state) => ({
  collapseViz: state.collapseViz,
  expandViz: state.expandViz,
  vizIsFullscreen: state.vizIsFullscreen,
});
function VisualizationFullScreenButton() {
  const { collapseViz, vizIsFullscreen, expandViz } = useVisualizationStore(visualizationStoreSelector);
  const vizTooltip = `${vizIsFullscreen ? 'Exit' : 'Enter'} Fullscreen`;
  return (
    <SecondaryBackgroundTooltip title={vizTooltip}>
      <FullScreenButton onClick={() => (vizIsFullscreen ? collapseViz() : expandViz())}>
        {vizIsFullscreen ? <FullscreenExitRoundedIcon color="primary" /> : <ZoomOutMapIcon color="primary" />}
      </FullScreenButton>
    </SecondaryBackgroundTooltip>
  );
}

export default VisualizationFullScreenButton;
