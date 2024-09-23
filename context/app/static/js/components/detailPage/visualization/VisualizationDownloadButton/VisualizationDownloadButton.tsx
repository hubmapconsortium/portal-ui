import React, { useCallback } from 'react';

import Download from '@mui/icons-material/Download';
import SvgIcon from '@mui/material/SvgIcon';

import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import postAndDownloadFile from 'js/helpers/postAndDownloadFile';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

const tooltip = 'Download Jupyter Notebook';

interface VisualizationDownloadButtonProps {
  uuid?: string;
  hasNotebook?: boolean;
}

function VisualizationDownloadButton({ uuid, hasNotebook }: VisualizationDownloadButtonProps) {
  const trackEntityPageEvent = useTrackEntityPageEvent();
  const { toastError } = useSnackbarActions();

  const downloadNotebook = useCallback(() => {
    trackEntityPageEvent({ action: `Vitessce / ${tooltip}` });
    postAndDownloadFile({
      url: `/notebooks/entities/dataset/${uuid}.ws.ipynb`,
      body: {},
    })
      .then()
      .catch(() => {
        toastError('Failed to download Jupyter Notebook');
      });
  }, [uuid, toastError, trackEntityPageEvent]);

  if (!uuid ?? !hasNotebook) {
    return null;
  }

  return (
    <SecondaryBackgroundTooltip title={tooltip}>
      <WhiteBackgroundIconButton onClick={downloadNotebook}>
        <SvgIcon color="primary" component={Download} />
      </WhiteBackgroundIconButton>
    </SecondaryBackgroundTooltip>
  );
}

export default VisualizationDownloadButton;
