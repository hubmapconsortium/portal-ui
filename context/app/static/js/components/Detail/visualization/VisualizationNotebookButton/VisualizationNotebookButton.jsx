import React from 'react';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';

function VisualizationNotebookButton() {
  return (
    <SecondaryBackgroundTooltip title="Download Jupyter Notebook">
      <WhiteBackgroundIconButton>
        <GetAppRoundedIcon color="primary" />
      </WhiteBackgroundIconButton>
    </SecondaryBackgroundTooltip>
  );
}

export default VisualizationNotebookButton;
