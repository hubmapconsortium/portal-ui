import React, { useCallback } from 'react';

import Download from '@mui/icons-material/Download';
import SvgIcon from '@mui/material/SvgIcon';

import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import postAndDownloadFile from 'js/helpers/postAndDownloadFile';
import { WhiteBackgroundIconTooltipButton } from 'js/shared-styles/buttons';

const tooltip = 'Download Jupyter Notebook';

interface VisualizationDownloadButtonProps {
  uuid?: string;
  hasNotebook?: boolean;
  parentUuid?: string;
}

function VisualizationDownloadButton({ uuid, hasNotebook, parentUuid }: VisualizationDownloadButtonProps) {
  const trackEntityPageEvent = useTrackEntityPageEvent();
  const { toastError } = useSnackbarActions();

  const downloadNotebook = useCallback(() => {
    trackEntityPageEvent({ action: `Vitessce / ${tooltip}` });
    postAndDownloadFile({
      url: `/notebooks/entities/dataset/${parentUuid ?? uuid}.ws.ipynb`,
      body: {},
    })
      .then()
      .catch(() => {
        toastError('Failed to download Jupyter Notebook');
      });
  }, [parentUuid, uuid, toastError, trackEntityPageEvent]);

  if (!uuid || !hasNotebook) {
    return null;
  }

  return (
    <WhiteBackgroundIconTooltipButton tooltip={tooltip} onClick={downloadNotebook}>
      <SvgIcon color="primary" component={Download} />
    </WhiteBackgroundIconTooltipButton>
  );
}

export default VisualizationDownloadButton;
