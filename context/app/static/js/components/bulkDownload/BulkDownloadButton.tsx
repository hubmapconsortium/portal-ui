import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import Download from '@mui/icons-material/Download';
import { useBulkDownloadDialog } from 'js/components/bulkDownload/hooks';
import { WhiteBackgroundIconTooltipButton } from 'js/shared-styles/buttons';

interface BulkDownloadButtonProps {
  tooltip: string;
  uuids: Set<string>;
}
function BulkDownloadButton({ tooltip, uuids }: BulkDownloadButtonProps) {
  const { openDialog } = useBulkDownloadDialog();

  return (
    <WhiteBackgroundIconTooltipButton tooltip={tooltip} onClick={() => openDialog(uuids)}>
      <SvgIcon color="primary" component={Download} />
    </WhiteBackgroundIconTooltipButton>
  );
}

export { BulkDownloadButton };
