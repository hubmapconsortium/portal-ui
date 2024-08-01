import React from 'react';
import Typography from '@mui/material/Typography';
import { useHandleCopyClick } from 'js/hooks/useCopyText';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import IconButton from '@mui/material/IconButton';
import CopyAllRounded from '@mui/icons-material/CopyAllRounded';
import StatusIcon from '../../StatusIcon';
import { useProcessedDatasetContext } from './ProcessedDatasetContext';

export function DatasetTitle() {
  const {
    dataset: { hubmap_id, status },
  } = useProcessedDatasetContext();
  const copyText = useHandleCopyClick();
  return (
    <Typography variant="h5" display="flex" alignItems="center" gap={0.5}>
      <StatusIcon status={status} />
      {hubmap_id}
      <SecondaryBackgroundTooltip title="Copy HuBMAP ID">
        <IconButton onClick={() => copyText(hubmap_id)}>
          <CopyAllRounded color="info" />
        </IconButton>
      </SecondaryBackgroundTooltip>
    </Typography>
  );
}
