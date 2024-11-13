import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import Download from '@mui/icons-material/Download';
import { useBulkDownloadDialog } from 'js/components/bulkDownload/hooks';
import { WhiteBackgroundIconTooltipButton } from 'js/shared-styles/buttons';
import { ButtonBaseProps } from '@mui/material';
import BulkDownloadDialog from 'js/components/bulkDownload/BulkDownloadDialog';

interface BulkDownloadButtonProps extends ButtonBaseProps {
  tooltip: string;
  uuids: Set<string>;
  deselectRows?: (uuids: string[]) => void;
}
function BulkDownloadButton({ tooltip, uuids, deselectRows, ...rest }: BulkDownloadButtonProps) {
  const { openDialog } = useBulkDownloadDialog({});

  return (
    <>
      <WhiteBackgroundIconTooltipButton tooltip={tooltip} onClick={() => openDialog(uuids)} {...rest}>
        <SvgIcon color="primary" component={Download} />
      </WhiteBackgroundIconTooltipButton>
      <BulkDownloadDialog deselectRows={deselectRows} />
    </>
  );
}

export default BulkDownloadButton;
