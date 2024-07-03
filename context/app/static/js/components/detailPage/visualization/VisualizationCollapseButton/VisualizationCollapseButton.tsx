import React from 'react';
import FullscreenExitRoundedIcon from '@mui/icons-material/FullscreenExitRounded';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import useVisualizationStore, { VisualizationStore } from 'js/stores/useVisualizationStore';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';

const visualizationStoreSelector = (state: VisualizationStore) => ({
  collapseViz: state.collapseViz,
});

function VisualizationCollapseButton() {
  const { collapseViz } = useVisualizationStore(visualizationStoreSelector);
  return (
    <SecondaryBackgroundTooltip title="Exit Fullscreen">
      <WhiteBackgroundIconButton onClick={collapseViz}>
        <FullscreenExitRoundedIcon color="primary" />
      </WhiteBackgroundIconButton>
    </SecondaryBackgroundTooltip>
  );
}

export default VisualizationCollapseButton;
