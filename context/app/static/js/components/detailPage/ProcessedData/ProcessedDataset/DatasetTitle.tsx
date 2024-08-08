import React from 'react';
import Typography from '@mui/material/Typography';
import { useHandleCopyClick } from 'js/hooks/useCopyText';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import IconButton from '@mui/material/IconButton';
import CopyAllRounded from '@mui/icons-material/CopyAllRounded';
import Box from '@mui/material/Box';
import StatusIcon from '../../StatusIcon';
import { useProcessedDatasetContext } from './ProcessedDatasetContext';
import VersionSelect from '../../VersionSelect';
import { useTrackEntityPageEvent } from '../../useTrackEntityPageEvent';

export function DatasetTitle() {
  const {
    dataset: { hubmap_id, status },
  } = useProcessedDatasetContext();
  const copyText = useHandleCopyClick();
  const track = useTrackEntityPageEvent();
  return (
    <Typography variant="h5" display="flex" alignItems="center" gap={0.5}>
      <StatusIcon status={status} />
      {hubmap_id}
      <SecondaryBackgroundTooltip title="Copy HuBMAP ID">
        <IconButton
          onClick={() => {
            copyText(hubmap_id);
            track({
              action: 'Copy HuBMAP ID',
              label: hubmap_id,
            });
          }}
        >
          <CopyAllRounded color="info" />
        </IconButton>
      </SecondaryBackgroundTooltip>
      <Box ml="auto">
        <VersionSelect />
      </Box>
    </Typography>
  );
}
