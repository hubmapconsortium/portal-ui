import React from 'react';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import postAndDownloadFile from 'js/helpers/postAndDownloadFile';

import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { StyledSecondaryBackgroundTooltip } from './style';

const title = 'Download Jupyter Notebook';

interface VisualizationNotebookButtonProps {
  uuid: string;
}

function VisualizationNotebookButton({ uuid }: VisualizationNotebookButtonProps) {
  const trackEntityPageEvent = useTrackEntityPageEvent();
  const { toastError } = useSnackbarActions();

  return (
    <StyledSecondaryBackgroundTooltip title={title}>
      <WhiteBackgroundIconButton
        onClick={() => {
          trackEntityPageEvent({ action: `Vitessce / ${title}` });
          postAndDownloadFile({
            url: `/notebooks/entities/dataset/${uuid}.ws.ipynb`,
            body: {},
          })
            .then(() => {
              // Do nothing
            })
            .catch(() => {
              toastError('Failed to download Jupyter Notebook');
            });
        }}
      >
        <GetAppRoundedIcon color="primary" />
      </WhiteBackgroundIconButton>
    </StyledSecondaryBackgroundTooltip>
  );
}

export default VisualizationNotebookButton;
