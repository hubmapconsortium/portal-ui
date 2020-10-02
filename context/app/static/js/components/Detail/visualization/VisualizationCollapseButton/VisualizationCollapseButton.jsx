import React from 'react';
import FullscreenExitRoundedIcon from '@material-ui/icons/FullscreenExitRounded';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import useVisualizationStore from 'js/stores/useVisualizationStore';

import { CollapseButton } from './style';

const visualizationStoreSelector = (state) => ({
  collapseViz: state.collapseViz,
});

function VisualizationCollapseButton() {
  const { collapseViz } = useVisualizationStore(visualizationStoreSelector);
  return (
    <SecondaryBackgroundTooltip title="Exit Fullscreen">
      <CollapseButton onClick={() => collapseViz()}>
        <FullscreenExitRoundedIcon color="primary" />
      </CollapseButton>
    </SecondaryBackgroundTooltip>
  );
}

export default VisualizationCollapseButton;
