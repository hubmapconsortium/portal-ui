import React from 'react';
import FullscreenExitRoundedIcon from '@material-ui/icons/FullscreenExitRounded';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMapRounded';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';

import useVisualizationStore from 'js/stores/useVisualizationStore';

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
      <WhiteBackgroundIconButton onClick={() => (vizIsFullscreen ? collapseViz() : expandViz())}>
        {vizIsFullscreen ? <FullscreenExitRoundedIcon color="primary" /> : <ZoomOutMapIcon color="primary" />}
      </WhiteBackgroundIconButton>
    </SecondaryBackgroundTooltip>
  );
}

export default VisualizationFullScreenButton;
