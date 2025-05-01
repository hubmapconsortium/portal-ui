import React from 'react';
import { ButtonProps } from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import Download from '@mui/icons-material/Download';
import { useBulkDownloadDialog } from 'js/components/bulkDownload/hooks';
import BulkDownloadDialog from 'js/components/bulkDownload/BulkDownloadDialog';
import DownloadButton from 'js/shared-styles/buttons/DownloadButton';

interface BulkDownloadButtonProps extends ButtonProps {
  tooltip: string;
  uuids: Set<string>;
  deselectRows?: (uuids: string[]) => void;
}
function BulkDownloadButton({ uuids, deselectRows, disabled, ...rest }: BulkDownloadButtonProps) {
  const { openDialog, isOpen } = useBulkDownloadDialog();

  return (
    <>
      <DownloadButton onClick={() => openDialog(uuids)} disabled={disabled} {...rest}>
        <SvgIcon color={disabled ? 'disabled' : 'primary'} component={Download} />
      </DownloadButton>
      {isOpen && <BulkDownloadDialog deselectRows={deselectRows} />}
    </>
  );
}

export default BulkDownloadButton;
