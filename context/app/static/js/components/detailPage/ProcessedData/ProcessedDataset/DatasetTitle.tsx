import React from 'react';
import Typography from '@mui/material/Typography';
import { useHandleCopyClick } from 'js/hooks/useCopyText';
import { ProcessedDatasetTypes } from 'js/pages/Dataset/hooks';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import IconButton from '@mui/material/IconButton';
import CopyAllRounded from '@mui/icons-material/CopyAllRounded';
import StatusIcon from '../../StatusIcon';

type ProcessedDataHeaderProps = Pick<ProcessedDatasetTypes, 'hubmap_id' | 'status'>;

export function DatasetTitle({ hubmap_id, status }: ProcessedDataHeaderProps) {
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
