import React from 'react';
import { ButtonProps } from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import Download from '@mui/icons-material/Download';
import { useBulkDownloadDialog } from 'js/components/bulkDownload/hooks';
import BulkDownloadDialog from 'js/components/bulkDownload/BulkDownloadDialog';
import { WhiteBackgroundIconTooltipButton } from 'js/shared-styles/buttons';

interface BulkDownloadButtonProps extends ButtonProps {
  tooltip: string;
  uuids: Set<string>;
  deselectRows?: (uuids: string[]) => void;
}
function BulkDownloadButton({ tooltip, uuids, deselectRows, ...rest }: BulkDownloadButtonProps) {
  const { openDialog } = useBulkDownloadDialog();

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
