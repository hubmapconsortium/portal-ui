import React from 'react';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';

function VisualizationNotebookButton(props) {
  const { uuid } = props;
  return (
    <SecondaryBackgroundTooltip title="Download Jupyter Notebook">
      <WhiteBackgroundIconButton component="a" href={`${uuid}.ipynb`}>
        <GetAppRoundedIcon color="primary" />
      </WhiteBackgroundIconButton>
    </SecondaryBackgroundTooltip>
  );
}

export default VisualizationNotebookButton;
