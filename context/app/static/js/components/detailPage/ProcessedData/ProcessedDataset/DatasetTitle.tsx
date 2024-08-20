import React from 'react';
import Typography from '@mui/material/Typography';
import { useHandleCopyClick } from 'js/hooks/useCopyText';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopyRounded';
import Stack from '@mui/material/Stack';
import StatusIcon from '../../StatusIcon';
import { useProcessedDatasetContext } from './ProcessedDatasetContext';
import VersionSelect from '../../VersionSelect';
import { useTrackEntityPageEvent } from '../../useTrackEntityPageEvent';
import SummaryJSONButton from '../../summary/SummaryJSONButton';

export function DatasetTitle() {
  const {
    dataset: { hubmap_id, status, uuid, entity_type },
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
          <ContentCopyIcon color="info" />
        </IconButton>
      </SecondaryBackgroundTooltip>
      <Stack ml="auto" direction="row" gap={1} alignItems="center">
        <SummaryJSONButton entity_type={entity_type} uuid={uuid} />
        <VersionSelect />
      </Stack>
    </Typography>
  );
}
